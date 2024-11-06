//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract IDOPool is IIDOPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint8 public constant RATE_DECIMALS = 4;

    uint8 public constant IDO_FEE_RATE = 500; // 0.05 % = 500 / 10^4

    uint8 public constant MIN_DELAY_STARTING = 10 * 60 * 60; // 10 minutes

    uint256 public constant MIN_PRICE_TOKEN = 10 ** 15; // = 0.001 WETH

    address public immutable UNISWAP_V3_FACTORY;

    bytes32 public immutable MERKLE_ROOT;

    IDOPoolDetails internal _poolDetail;

    IDOType internal idoType;

    bool internal hasWithdrawn;

    mapping(address => uint256) internal userDepositAmount;

    // MODIFIER
    modifier onlyPoolOwner() {
        if (_msgSender() != _poolDetail.poolOwner) {
            revert NotPoolOwner();
        }
        _;
    }

    modifier notZeroAddress(address _address) {
        if (_address == address(0)) {
            revert ZeroAddress();
        }
        _;
    }

    modifier isInIDOTimeFrame() {
        uint256 currentTime = block.timestamp;
        if (currentTime < _poolDetail.startTime) {
            revert IDOIsNotStarted();
        }
        if (currentTime > _poolDetail.endTime) {
            revert IDOIsEnded();
        }
        _;
    }

    modifier inWhitelisted(address _address) {
        // if (!whitelistedAddresses[_address]) {
        //     revert NotWhilelisted();
        // }
        _;
    }

    modifier notWhiteListed(address _address) {
        // if (whitelistedAddresses[_address]) {
        //     revert AlreadyWhitelisted();
        // }
        _;
    }

    modifier inWithdrawnTime() {
        if (block.timestamp < _poolDetail.endTime) {
            revert IDOPoolStillActive();
        }
        _;
    }

    modifier softCapReached() {
        if (_poolDetail.softCap > _poolDetail.raisedAmount) {
            revert SoftCapNotReach();
        }
        _;
    }

    modifier notWithdrawn() {
        if (hasWithdrawn) {
            revert AlreadyWithdrawn();
        }
        _;
    }

    constructor(
        address owner,
        address tokenAddress,
        uint256 pricePerToken, // 1 TOKEN = ? WETH
        uint256 startTime,
        uint256 endTime,
        uint256 minInvest,
        uint256 maxInvest,
        uint256 hardCap,
        uint256 softCap,
        bool _isPrivateSales,
        uint256 liquidityWETH9,
        uint256 liquidityToken,
        address factory,
        bytes32 _merkleRoot
    ) notZeroAddress(owner) Ownable(msg.sender) {
        if (hardCap <= 0 || hardCap <= softCap) {
            revert InvalidPoolSoftCap();
        }
        if (softCap <= 0) {
            revert InvalidPoolHardCap();
        }
        if (maxInvest <= 0 || maxInvest >= hardCap || maxInvest < minInvest) {
            revert InvalidPoolMaxInvestment();
        }
        if (minInvest <= 0) {
            revert InvalidPoolMinInvestment();
        }
        if (startTime < block.timestamp || startTime > endTime) {
            revert InvalidPoolTimeFrame();
        }
        if (startTime < MIN_DELAY_TIME + block.timestamp) {
            revert InvalidPoolDelayTime();
        }
        if (pricePerToken) _poolDetail.poolOwner = owner;
        _poolDetail.tokenAddress = tokenAddress;
        _poolDetail.pricePerToken = pricePerToken;
        _poolDetail.startTime = startTime;
        _poolDetail.endTime = endTime;
        _poolDetail.softCap = softCap;
        _poolDetail.hardCap = hardCap;
        _poolDetail.minInvest = minInvest;
        _poolDetail.maxInvest = maxInvest;
        _poolDetail.liquidityWETH9 = liquidityWETH9;
        _poolDetail.liquidityToken = liquidityToken;

        idoType = _isPrivateSales ? IDOType.PRIVATE_SALE : IDOType.PUBLIC_SALE;

        UNISWAP_V3_FACTORY = factory;

        MERKLE_ROOT = _merkleRoot;
    }

    function listInDex()
        external
        override
        onlyOwner
        nonReentrant
        inWithdrawnTime
        softCapReached
        notWithdrawn
        returns (address)
    {}

    function investPool() external payable override {
        address investor = _msgSender();

        if (idoType == IDOType.PRIVATE_SALE) {
            // TODO: check the investor whether is whitelisted.
        }

        uint256 amountInvestment = msg.value;
        IDOPoolDetails memory _poolDetail_ = getPoolDetails();
        uint256 currentTime = block.timestamp;
        uint256 depositedAmount = userDepositAmount[investor];

        if (currentTime < _poolDetail.startTime) {
            revert IDOIsNotStarted();
        }
        if (currentTime > _poolDetail.endTime) {
            revert IDOIsEnded();
        }

        if (_poolDetail_.raisedAmount + amountInvestment > hardCap) {
            revert HardCapExceeded();
        }

        if (amountInvestment + depositedAmount < _poolDetail_.minInvest) {
            revert MinInvestmentNotReached();
        }

        if (amountInvestment + depositedAmount > _poolDetail_.maxInvest) {
            revert MaxInvestmentExceeded();
        }

        uint256 amountToken = (_poolDetail_.pricePerToken * amountInvestment) /
            10 ** 18;
        userDepositAmount[investor] += amountInvestment;

        emit IDOPoolInvested(investor, amountInvestment);
    }

    function cancelInvestment() external override {
        address investor = _msgSender();

        uint256 investedAmount = userDepositAmount[investor];
        if (investedAmount == 0) {
            revert NotEnoughBalance();
        }

        IDOPoolDetails memory pool = _idoDetail;
        uint256 currentTime = block.timestamp;
        if (currentTime < pool.startTime) {
            revert IDOIsNotStarted();
        }
        if (currentTime > pool.endTime) {
            revert IDOIsEnded();
        }

        // TODO: Finish the cancel investment
    }

    // Redeem token after IDO finished
    function redeemToken() external override {
        address investor = _msgSender();
        uint256 investedAmount = userDepositAmount[investor];
        if (investedAmount == 0) {
            revert NotEnoughBalance();
        }
        IDOPoolDetails memory pool = getPoolDetails();
        // TODO: Check the decimal of token
        uint256 redeemAmount = (pool.pricePerToken * investedAmount) / 10 ** 18;

        IERC20(pool.tokenAddress).safeTransfer(investor, redeemAmount);

        emit IDOPoolRedeemed(investor, redeemAmount);
    }

    // Refund when the pool has not reached soft cap
    function refundToken() external override {
        address investor = _msgSender();
        uint256 investedAmount = userDepositAmount[investor];
        if (investedAmount == 0) {
            revert NotEnoughBalance();
        }
        IDOPoolDetails memory pool = _idoDetail;
        uint256 currentTime = block.timestamp;
        if (currentTime <= pool.endTime) {
            revert IDOIsNotEnded();
        }
        if (pool.raisedAmount >= pool.softCap) {
            revert SoftCapReached();
        }

        investor.transfer(investedAmount);
    }

    function changeToPublicSale() external override {
        IDOPoolDetails memory pool = _poolDetail;
        if (idoType == IDOType.PUBLIC_SALE) {
            revert IDOIsAlreadyPublicSale();
        }
        uint256 currentTime = block.timestamp;
        if (currentTime >= pool.startTime) {
            revert IDOIsAlreadyStarted();
        }

        idoType = IDOType.PUBLIC_SALE;
    }

    // INTERNAL FUCNTIONS

    // TODO: Implement the verifyAddress in the Merkle Root
    // function _verifyAddress(bytes32[])

    // PUBLIC FUCNTIONS

    function getPoolDetails()
        external
        view
        override
        returns (IDOPoolDetails memory)
    {
        return _poolDetail;
    }

    function getPoolRaisedAmount() external view override returns (uint256) {
        return _poolDetail.raisedAmount;
    }

    function getPoolSoftCap() external view override returns (uint256) {
        return _poolDetail.softCap;
    }

    function getPoolHardCap() external view override returns (uint256) {
        return _poolDetail.hardCap;
    }

    function isWhitelisted(
        address _address
    ) external view override returns (bool) {
        // TODO: implement internal function to check whitelisted
        return false;
    }

    function getPoolMinInvest() external view override returns (uint256) {
        return _poolDetail.minInvest;
    }

    function getPoolMaxInvest() external view override returns (uint256) {
        return _poolDetail.maxInvest;
    }

    function isPoolActive() external view override returns (uint256) {
        return block.timestamp < _poolDetail.endTime;
    }

    function getTimeLeftEnding() external view override returns (uint256) {
        uint256 currentTime = block.timestamp;
        return
            _poolDetail.endTime > currentTime
                ? _poolDetail.endTime - currentTime
                : 0;
    }

    function getUserDepositAmount(
        address _address
    ) external view override returns (uint256) {
        return userDepositAmount[_address];
    }

    function getPoolOwner() external view override returns (address) {
        return _poolDetail.owner;
    }

    function getAmountToTopUp() external view override returns (uint256) {
        uint256 hardCap = getPoolHardCap();
        uint8 poolTokenDecimals = IERC20(getPoolTokenAddress()).decimals();
        uint256 toBeToppedUp = (hardCap * (10 ** poolTokenDecimals)) /
            _poolDetail.pricePerToken;
        return toBeToppedUp;
    }

    function getPoolTokenAddress() external view override returns (uint256) {
        return _poolDetail.tokenAddress;
    }

    function getPoolTokenToppedUpAmount()
        external
        view
        override
        returns (uint256)
    {
        return IERC20(getPoolTokenAddress()).balanceOf(address(this));
    }

    function getPoolStartTime() external view override returns (uint256) {
        return _poolDetail.startTime;
    }

    function getPoolEndTime() external view override returns (uint256) {
        return _poolDetail.endTime;
    }

    function getPoolSoftCapReached() external view override returns (bool) {
        uint256 raisedAmount = _poolDetail.raisedAmount;
        uint256 softCap = _poolDetail.softCap;
        return softCap == 0 ? false : raisedAmount >= softCap;
    }

    function getPricePerToken() external view override returns (uint256) {
        return _poolDetail.pricePerToken;
    }

    // RECEIVE FUNCTIONS
    receive() external payable {}
}
