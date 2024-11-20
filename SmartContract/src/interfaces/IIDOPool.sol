//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOFactory} from "../interfaces/IIDOFactory.sol";

interface IIDOPool {
    enum IDOType {
        PUBLIC_SALE,
        PRIVATE_SALE
    }

    struct IDOPoolDetails {
        address tokenAddress;
        uint256 pricePerToken;
        uint256 startTime;
        uint256 endTime;
        uint256 raisedAmount;
        uint256 raisedTokenAmount;
        uint256 softCap;
        uint256 hardCap;
        uint256 minInvest;
        uint256 maxInvest;
        uint256 liquidityWETH9;
        uint256 liquidityToken;
        bytes32 whitelistedRoot;
    }

    struct Investor {
        uint256 depositedAmount;
        uint256 tokenAmount;
        bool claimed; // use in both claimToken and refundToken
    }

    // ERRORS
    error NotPoolOwner();
    error NotPoolOwnerOrFactory();
    error ZeroAddress();
    error InvalidPoolId();

    error InvalidPoolSoftCap();
    error InvalidPoolHardCap();
    error InvalidPoolMinInvestment();
    error InvalidPoolMaxInvestment();
    error InvalidTokenPrice();
    error InvalidTokenForSale();
    error InvalidPoolTimeFrame();
    error InvalidPoolDelayTime();

    error NotEnoughBalance();
    error IDOIsNotStarted();
    error IDOIsAlreadyStarted();
    error IDOIsEnded();
    error IDOIsNotEnded();
    error HardCapExceeded();
    error SoftCapNotReached();
    error SoftCapReached();

    error MinInvestmentNotReached();
    error MaxInvestmentExceeded();
    error NotWhilelisted();
    error AlreadyWhitelisted();

    error IDOPoolStillActive();
    error AlreadyListedDex();
    error IDOIsAlreadyPublicSale();

    error IDOPoolIsPrivate();
    error IDOPoolIsPublic();
    error InvalidLiquidityAmount();
    error InvestorClaimed();
    error IDOPoolInitialized();

    // EVENTS
    // event Whitelisted()

    event IDOPoolCreated(
        address indexed poolOwner,
        address indexed tokenAddress,
        uint256 poolId,
        uint256 pricePerToken,
        uint256 startTime,
        uint256 endTime
    );

    event IDOPoolInvested(address indexed investor, uint256 amount);

    event IDOPoolWithdrawn(address indexed investor, uint256 amount);

    event IDOPoolClaimed(address indexed investor, uint256 amount);

    event IDOPoolListed(
        address indexed tokenAddress,
        address liquidityPool,
        uint256 liquidityWETHAmount,
        uint256 liquidityTokenAmount,
        uint256 lpTokenAmount
    );

    event IDOPoolRefunded(address indexed investor, uint256 amount);

    event IDOPoolChangedToPublic();

    // VIEW FUNCTIONS

    function getPoolDetails() external view returns (IDOPoolDetails memory);

    function getPoolRaisedAmount() external view returns (uint256);

    function getPoolSoftCap() external view returns (uint256);

    function isWhitelisted(address _address) external view returns (bool);

    function getPoolMinInvest() external view returns (uint256);

    function getPoolMaxInvest() external view returns (uint256);

    function isPoolActive() external view returns (bool);

    function getTimeLeftEnding() external view returns (uint256);

    function getUserDepositAmount(
        address _address
    ) external view returns (uint256);

    function getPoolOwner() external view returns (address);

    function getAmountToTopUp() external view returns (uint256);

    function getPoolTokenToppedUpAmount() external view returns (uint256);

    function getPoolStartTime() external view returns (uint256);

    function getPoolEndTime() external view returns (uint256);

    function getPoolSoftCapReached() external view returns (bool);

    function getPricePerToken() external view returns (uint256);

    function getLiquidityWETH9Amount() external view returns (uint256);

    function getLiquidityTokenAmount() external view returns (uint256);

    function getPoolHardCap() external view returns (uint256);

    function getPoolTokenAddress() external view returns (address);

    function getPoolTokenAmount() external view returns (uint256);

    // EXECUTING FUNCTIONS
    function initialize(
        IDOPoolDetails memory _poolDetails,
        address _poolOwner
    ) external;

    function listInDex(address to) external returns (address);

    function investPublicPool() external payable;

    function investPrivatePool(
        bytes32[] memory proof,
        bytes32 leaf
    ) external payable;

    function cancelInvestment() external;

    function claimToken() external;

    function refundToken() external;

    function withdrawRemainingToken() external payable;

    function changeToPublicSale() external;
}
