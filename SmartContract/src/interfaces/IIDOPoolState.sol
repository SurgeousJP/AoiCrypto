//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIDOPoolState {
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

    error InvalidPoolStartPublicSale();

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

    error NotListedDex();

    error IDOIsAlreadyPublicSale();

    error IDOPoolIsPrivate();

    error IDOPoolIsPublic();

    error IDOPoolIsPrivateForWhitelisted();

    error InvalidLiquidityAmount();

    error InvestorClaimed();

    error IDOPoolInitialized();

    error IDOPoolNotInitialized();

    error InvestorAlreadyRegistered();

    error InvestorNotRegisteredYet();

    error InvalidPrivateSaleAmount();

    error IDOPoolHasWithdrawn();

    error PrivateSaleExceeded();

    // EVENTS

    event IDOPoolCreated(
        address indexed poolOwner,
        address indexed tokenAddress,
        uint256 poolId,
        uint256 pricePerToken,
        uint256 startTime,
        uint256 endTime
    );

    event IDOPoolInvested(address indexed investor, uint256 amount);

    event IDOPoolInvestmentCanceled(address indexed investor, uint256 amount);

    event IDOPoolWithdrawn(uint256 tokenAmount, uint256 ethAmount);

    event IDOPoolClaimed(address indexed investor, uint256 amount);

    event IDOPoolListed(
        address indexed tokenAddress,
        address liquidityPool,
        uint256 liquidityWETHAmount,
        uint256 liquidityTokenAmount,
        uint256 lpTokenAmount
    );

    event IDOPoolRefunded(address indexed investor, uint256 amount);

    event RegisteredPrivatePool(address indexed investor);

    event CanceledPrivatePoolRegistration(address indexed investor);

    event IdoPoolInitialized();
}