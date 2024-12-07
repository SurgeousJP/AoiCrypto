//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {IIDOFactory} from "../interfaces/IIDOFactory.sol";
import {IAoiFactory} from "../interfaces/DEX/IAoiFactory.sol";
import {IAoiPair} from "../interfaces/DEX/IAoiPair.sol";
import {IAoiRouter} from "../interfaces/DEX/IAoiRouter.sol";
import {IDOPoolState} from "./IDOPoolState.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";

contract IDOPool is IDOPoolState, IIDOPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using FixedPointMathLib for uint256;
    using SafeTransferLib for address;
    using MerkleProof for bytes32[];

    IDOType internal IDO_TYPE;

    IDOPoolDetails internal poolDetail;

    IDOTime internal poolTime;

    mapping(address => Investor) internal investors;

    // MODIFIER

    modifier notZeroAddress(address _address) {
        if (_address == address(0)) {
            revert ZeroAddress();
        }
        _;
    }

    modifier isInIDOTimeFrame() {
        uint256 currentTime = block.timestamp;
        if (currentTime < poolTime.startTime) {
            revert IDOIsNotStarted();
        }
        if (currentTime > poolTime.endTime) {
            revert IDOIsEnded();
        }
        _;
    }

    modifier isIDONotStarted() {
        if (block.timestamp >= poolTime.startTime) {
            revert IDOIsNotStarted();
        }
        _;
    }

    modifier isIDOFinished() {
        if (block.timestamp <= poolTime.endTime) {
            revert IDOPoolStillActive();
        }
        _;
    }

    modifier softCapReached() {
        if (poolDetail.softCap > poolDetail.raisedAmount) {
            revert SoftCapNotReached();
        }
        _;
    }

    modifier softCapNotReached() {
        if (poolDetail.softCap <= poolDetail.raisedAmount) {
            revert SoftCapReached();
        }
        _;
    }

    modifier notListedDex() {
        if (hasListedDex) {
            revert AlreadyListedDex();
        }
        _;
    }

    modifier listedDex() {
        if (!hasListedDex) {
            revert NotListedDex();
        }
        _;
    }

    modifier isInitialized() {
        if (!initialized) {
            revert IDOPoolNotInitialized();
        }
        _;
    }

    constructor(
        address _WETH,
        address _AOI_DEX_FACTORY,
        address _AOI_DEX_ROUTER
    )
        IDOPoolState(_WETH, _AOI_DEX_FACTORY, _AOI_DEX_ROUTER)
        Ownable(msg.sender) // Factory
    {}

    function initialize(
        IDOPoolDetails memory _poolDetail,
        IDOTime memory _poolTime,
        address _POOL_OWNER,
        bytes32 _WHITELISTED, // Allows to be default value
        bool _PRIVATE_SALE
    ) external override {
        if (initialized) {
            revert IDOPoolInitialized();
        }
        if (_poolDetail.tokenAddress == address(0)) {
            revert ZeroAddress();
        }
        if (_poolDetail.pricePerToken == 0) {
            revert InvalidTokenPrice();
        }
        if (
            _poolTime.startTime < block.timestamp ||
            _poolTime.startTime > _poolTime.endTime
        ) {
            revert InvalidPoolTimeFrame();
        }
        if (_poolTime.startTime < MIN_DELAY_STARTING + block.timestamp) {
            revert InvalidPoolDelayTime();
        }
        if (
            _PRIVATE_SALE &&
            (_poolDetail.privateSaleAmount == 0 ||
                _poolDetail.privateSaleAmount > _poolDetail.hardCap)
        ) {
            revert InvalidPrivateSaleAmount();
        }
        if (
            IDO_TYPE == IDOType.PRIVATE_SALE && 
            (
                (_poolDetail.privateSaleAmount == _poolDetail.hardCap && _poolTime.startPublicSale != 0) 
                || 
            (_poolTime.startPublicSale >= _poolTime.endTime || _poolTime.startPublicSale < _poolTime.startTime + MIN_PRIVATE_SALES_ENDING)
            )
        ) {
            revert InvalidPoolStartPublicSale();
        }
        if (
            _poolDetail.maxInvest == 0 ||
            _poolDetail.maxInvest >= _poolDetail.hardCap ||
            _poolDetail.maxInvest < _poolDetail.minInvest
        ) {
            revert InvalidPoolMaxInvestment();
        }
        if (_poolDetail.minInvest <= 0 || (_poolDetail.hardCap / _poolDetail.minInvest) * _poolDetail.minInvest < _poolDetail.softCap) {
            revert InvalidPoolMinInvestment();
        }
        if (
            _poolDetail.hardCap <= 0 ||
            _poolDetail.hardCap <= _poolDetail.softCap
        ) {
            revert InvalidPoolSoftCap();
        }
        if (_poolDetail.softCap <= 0) {
            revert InvalidPoolHardCap();
        }
        if (_poolDetail.liquidityWETH9 < MIN_WETH) {
            revert InvalidLiquidityAmount();
        }
        poolDetail = _poolDetail;
        poolTime = _poolTime;
        IDO_TYPE = _PRIVATE_SALE ? IDOType.PRIVATE_SALE : IDOType.PUBLIC_SALE;
        POOL_OWNER = _POOL_OWNER;
        WHITELISTED = _WHITELISTED;
        initialized = true;

        emit IdoPoolInitialized();
    }

    function listInDex(
        address to
    )
        external
        override
        onlyOwner
        nonReentrant
        isInitialized
        notListedDex
        returns (address liquidityPoolAddress, uint256 lpAmount)
    {
        IDOPoolDetails memory _poolDetail = poolDetail;
        IDOTime memory _poolTime = poolTime;
        if (_poolTime.endTime > block.timestamp) {
            revert IDOIsNotEnded();
        }

        if (_poolDetail.raisedAmount < _poolDetail.softCap) {
            revert SoftCapNotReached();
        }
        IERC20(_poolDetail.tokenAddress).approve(
            AOI_DEX_ROUTER,
            _poolDetail.liquidityToken
        );
        // Create LP & Add liquidityPool
        (, , lpAmount) = IAoiRouter(AOI_DEX_ROUTER).addLiquidityETH{
            value: _poolDetail.liquidityWETH9
        }(
            _poolDetail.tokenAddress,
            _poolDetail.liquidityToken,
            _poolDetail.liquidityToken,
            _poolDetail.liquidityWETH9,
            to,
            block.timestamp
        );
        // Get the LP address
        liquidityPoolAddress = IAoiFactory(AOI_DEX_FACTORY).getPair(
            _poolDetail.tokenAddress,
            WETH
        );
        require(liquidityPoolAddress != address(0));

        // Save state
        hasListedDex = true;

        emit IDOPoolListed(
            _poolDetail.tokenAddress,
            liquidityPoolAddress,
            _poolDetail.liquidityWETH9,
            _poolDetail.liquidityToken,
            lpAmount
        );
    }

    function investPool(
        bytes32[] memory proof
    ) external payable override isInIDOTimeFrame isInitialized {
        IDOTime memory _poolTime = poolTime;
        IDOPoolDetails memory _poolDetail = poolDetail;
        address investorAddress = _msgSender();
        Investor memory investor = investors[investorAddress];
        uint256 amountInvestment = msg.value;
        uint256 currentTime = block.timestamp;
        
        if (_poolDetail.hardCap < _poolDetail.raisedAmount + amountInvestment) {
            revert HardCapExceeded();
        }
        if (
            amountInvestment + investor.depositedAmount < _poolDetail.minInvest
        ) {
            revert MinInvestmentNotReached();
        }
        if (
            amountInvestment + investor.depositedAmount > _poolDetail.maxInvest
        ) {
            revert MaxInvestmentExceeded();
        }
        if (IDO_TYPE == IDOType.PRIVATE_SALE && currentTime < _poolTime.startPublicSale) {
            if (!_verifyProof(proof, WHITELISTED, investorAddress) && !registers[investorAddress]) {
                revert IDOPoolIsPrivate();
            }
            if (_poolDetail.privateSaleAmount <= _poolDetail.raisedAmount + amountInvestment) {
                revert PrivateSaleExceeded();
            }
        } 
        _invest(investorAddress, msg.value);
    }

    function registerPrivatePool()
        external
        override
        isInitialized
        isIDONotStarted
    {
        if (IDO_TYPE == IDOType.PUBLIC_SALE) {
            revert IDOPoolIsPublic();
        }
        if (poolTime.startPublicSale == 0) {
            revert IDOPoolIsPrivateForWhitelisted();
        }
        address investor = _msgSender();
        if (registers[investor]) {
            revert InvestorAlreadyRegistered();
        }
        registers[investor] = true;

        emit RegisteredPrivatePool(investor);
    }

    function cancelRegisterPrivatePool() external {
        if (IDO_TYPE == IDOType.PUBLIC_SALE) {
            revert IDOPoolIsPublic();
        }
        if (poolTime.startPublicSale == 0) {
            revert IDOPoolIsPrivateForWhitelisted();
        }
        address investor = _msgSender();
        if (!registers[investor]) {
            revert InvestorNotRegisteredYet();
        }
        registers[investor] = false;

        emit CanceledPrivatePoolRegistration(investor);
    }

    // Cancel whole invested amount.
    function cancelInvestment()
        external
        override
        isInIDOTimeFrame
        isInitialized
    {
        address investorAddress = _msgSender();

        Investor memory investor = investors[investorAddress];
        uint256 investedAmount = investor.depositedAmount;
        uint256 tokenAmount = investor.tokenAmount;
        if (investedAmount == 0 || tokenAmount == 0) {
            revert NotEnoughBalance();
        }

        // Save state
        investors[investorAddress].depositedAmount = 0;
        investors[investorAddress].tokenAmount = 0;
        poolDetail.raisedAmount -= investedAmount;
        poolDetail.raisedTokenAmount -= tokenAmount;

        // Transfer whole invested amount back to investor
        investorAddress.safeTransferETH(investedAmount);

        emit IDOPoolInvestmentCanceled(investorAddress, investedAmount);
    }

    // Redeem token after IDO finished
    function claimToken()
        external
        override
        isIDOFinished
        softCapReached
        isInitialized
    {
        address investorAddress = _msgSender();
        Investor memory investor = investors[investorAddress];
        if (investor.claimed) {
            revert InvestorClaimed();
        }
        uint256 claimAmount = investors[investorAddress].tokenAmount;
        if (claimAmount == 0) {
            revert NotEnoughBalance();
        }

        // Transfer token to investor
        IERC20(poolDetail.tokenAddress).safeTransfer(
            investorAddress,
            claimAmount
        );

        // Save state
        investors[investorAddress].claimed = true;

        emit IDOPoolClaimed(investorAddress, claimAmount);
    }

    // Refund when the pool has not reached soft cap
    function refundToken()
        external
        override
        isIDOFinished
        softCapNotReached
        isInitialized
    {
        address investorAddress = _msgSender();
        Investor memory investor = investors[investorAddress];
        if (investor.claimed) {
            revert InvestorClaimed();
        }
        uint256 investedAmount = investor.depositedAmount;
        if (investedAmount == 0) {
            revert NotEnoughBalance();
        }
        // Save state
        investors[investorAddress].claimed = true;
        // Transfer ETH back to investor
        investorAddress.safeTransferETH(investedAmount);

        emit IDOPoolRefunded(investorAddress, investedAmount);
    }

    function withdrawRemainingToken()
        external
        payable
        override
        isInitialized
        listedDex
    {
        if (hasWithdrawn) {
            revert IDOPoolHasWithdrawn();
        }
        IDOPoolDetails memory _poolDetail = poolDetail;
        uint256 withdrawalETH = _poolDetail.raisedAmount >= address(this).balance ? address(this).balance : _poolDetail.raisedAmount;
        uint256 tokenAmountInHardCap = _poolDetail.hardCap.mulWad(_poolDetail.pricePerToken);
        uint256 withdrawalToken = _poolDetail.raisedTokenAmount >= tokenAmountInHardCap ? 0 : tokenAmountInHardCap - _poolDetail.raisedTokenAmount;

        hasWithdrawn = true;

        // Transfer
        if (withdrawalETH != 0) {
            POOL_OWNER.safeTransferETH(withdrawalETH);
        }
        if (withdrawalToken != 0) {
            IERC20(_poolDetail.tokenAddress).safeTransfer(POOL_OWNER, withdrawalToken);
        }

        emit IDOPoolWithdrawn(withdrawalToken, withdrawalETH);
    }

    // INTERNAL FUCNTIONS
    function _verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        address addr
    ) internal pure returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr))));
        return proof.verify(root, leaf);
    }

    function _invest(
        address investorAddress,
        uint256 amountInvestment
    ) internal {
        IDOPoolDetails memory _poolDetail = poolDetail;
        uint256 amountToken = poolDetail.pricePerToken.mulWad(amountInvestment);
        require(amountToken > 0);

        // Save state
        poolDetail.raisedAmount += amountInvestment;
        poolDetail.raisedTokenAmount += amountToken;
        investors[investorAddress].depositedAmount += amountInvestment;
        investors[investorAddress].tokenAmount += amountToken;

        emit IDOPoolInvested(investorAddress, amountInvestment);
    }
    // PUBLIC FUCNTIONS

    function getPoolDetails()
        external
        view
        override
        returns (IDOPoolDetails memory)
    {
        return poolDetail;
    }

    function getPoolTime() external view override returns (IDOTime memory) {
        return poolTime;
    }

    function getPoolSoftCap() external view override returns (uint256) {
        return poolDetail.softCap;
    }

    function getPoolHardCap() external view override returns (uint256) {
        return poolDetail.hardCap;
    }

    function isRegistered(
        address _address
    ) external view override returns (bool) {
        return registers[_address];
    }

    function getPoolMinInvest() external view override returns (uint256) {
        return poolDetail.minInvest;
    }

    function getPoolMaxInvest() external view override returns (uint256) {
        return poolDetail.maxInvest;
    }

    function isPoolActive() external view override returns (bool) {
        uint256 currentTime = block.timestamp;
        return
            currentTime >= poolTime.startTime &&
            currentTime <= poolTime.endTime;
    }

    function getTimeLeftEnding() external view override returns (uint256) {
        uint256 currentTime = block.timestamp;
        return
            poolTime.endTime > currentTime ? poolTime.endTime - currentTime : 0;
    }

    function getUserDepositAmount(
        address _address
    ) external view override returns (uint256) {
        Investor memory investor = investors[_address];
        return investor.depositedAmount;
    }

    function getPoolOwner() external view override returns (address) {
        return POOL_OWNER;
    }

    function getPoolTokenAddress() external view override returns (address) {
        return poolDetail.tokenAddress;
    }

    function getPoolStartTime() external view override returns (uint256) {
        return poolTime.startTime;
    }

    function getPoolEndTime() external view override returns (uint256) {
        return poolTime.endTime;
    }

    function getPoolSoftCapReached() external view override returns (bool) {
        uint256 raisedAmount = poolDetail.raisedAmount;
        uint256 softCap = poolDetail.softCap;
        return softCap == 0 ? false : raisedAmount >= softCap;
    }

    function getPricePerToken() external view override returns (uint256) {
        return poolDetail.pricePerToken;
    }

    function getLiquidityTokenAmount()
        external
        view
        override
        returns (uint256)
    {
        return poolDetail.liquidityToken;
    }

    function getLiquidityWETH9Amount()
        external
        view
        override
        returns (uint256)
    {
        return poolDetail.liquidityWETH9;
    }

    function getPoolTokenAmount() external view override returns (uint256) {
        return poolDetail.raisedTokenAmount;
    }

    function getPoolRaisedAmount() external view override returns (uint256) {
        return poolDetail.raisedAmount;
    }

    function getPoolType() external view override returns (IDOType) {
        return IDO_TYPE;
    }

    function getHasListedDex() external view override returns (bool) {
        return hasListedDex;
    }

    // RECEIVE FUNCTIONS
    receive() external payable {}
}
