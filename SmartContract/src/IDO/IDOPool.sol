//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IDOPool is IIDOPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IDOPoolDetails internal _poolDetail;

    uint256 public constant RATE_DECIMALS = 4;

    uint256 public constant IDO_FEE_RATE = 50;

    address public immutable UNISWAP_V3_FACTORY;

    bool public hasWithdrawn;

    mapping(address => uint256) private userDepositAmount;
    mapping(address => bool) private whitelistedAddresses;

    bool public isPrivateSales;

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
        if (!whitelistedAddresses[_address]) {
            revert NotWhilelisted();
        }
        _;
    }

    modifier notWhiteListed(address _address) {
        if (whitelistedAddresses[_address]) {
            revert AlreadyWhitelisted();
        }
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
        uint256 pricePerToken,
        uint256 startTime,
        uint256 endTime,
        uint256 minInvest,
        uint256 maxInvest,
        uint256 hardCap,
        uint256 softCap,
        bool _isPrivateSales,
        uint256 liquidityWETH9,
        uint256 liquidityToken,
        address factory
    ) notZeroAddres(owner) Ownable(msg.sender) {
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

        _poolDetail.poolOwner = owner;
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

        hasWithdrawn = false;
        isPrivateSales = _isPrivateSales;

        UNISWAP_V3_FACTORY = factory;
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

    // TODO: implement that allow only in whitelisted
    function investPool(
        uint256 amount
    ) external payable override isInIDOTimeFrame {
        address investor = _msgSender();

        IDOPoolDetails memory pool = getPoolDetails();

        // uint256 reserveAmount =
    }

    function joinWhitelist() external override {}

    function redeemToken() external override {}

    function refundToken() external override {}

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
        if (!isPrivateSales) {
            return true;
        }
        return whitelistedAddresses[_address];
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
