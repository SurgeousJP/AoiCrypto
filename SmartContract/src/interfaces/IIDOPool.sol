//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIDOPool {
    struct IDOPoolDetails {
        address poolOwner;
        address tokenAddress;
        uint256 pricePerToken;
        uint256 startTime;
        uint256 endTime;
        uint256 raisedAmount;
        uint256 softCap;
        uint256 hardCap;
        uint256 minInvest;
        uint256 maxInvest;
        uint256 liquidityWETH9;
        uint256 liquidityToken;
    }

    enum IDOType {
        PUBLIC_SALE,
        PRIVATE_SALE
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
    error IDOIsNotEnded():
    error HardCapExceeded();
    error SoftCapNotReach();
    error SoftCapReached();

    error MinInvestmentNotReached();
    error MaxInvestmentExceeded();
    error NotWhilelisted();
    error AlreadyWhitelisted();

    error IDOPoolStillActive();
    error AlreadyWithdrawn();
    error IDOIsAlreadyPublicSale();

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

    event IDOPoolInvested(
        address indexed investor,
        uint256 amount
    );

    event IDOPoolWithdrawn(
        address indexed investor,
        uint256 amount
    );

    event IDOPoolRedeemed(
        address indexed investor,
        uint256 amount
    );

    event IDOPoolListing();

    // VIEW FUNCTIONS
    function getPoolDetails() external view returns (IDOPoolDetails memory);

    function getPoolRaisedAmount() external view returns (uint256);

    function getPoolSoftCap() external view returns (uint256);

    function getPoolHardCap() external view returns (uint256);

    function isWhitelisted(address _address) external view returns (bool);

    function getPoolMinInvest() external view returns (uint256);

    function getPoolMaxInvest() external view returns (uint256);

    function isPoolActive() external view returns (uint256);

    function getTimeLeftEnding() external view returns (uint256);

    function getUserDepositAmount(
        address _address
    ) external view returns (uint256);

    function getPoolOwner() external view returns (address);

    function getAmountToTopUp() external view returns (uint256);

    function getPoolTokenAddress() external view returns (uint256);

    function getPoolTokenToppedUpAmount() external view returns (uint256);

    function getPoolStartTime() external view returns (uint256);

    function getPoolEndTime() external view returns (uint256);

    function getPoolSoftCapReached() external view returns (bool);

    function getPricePerToken() external view returns (uint256);

    // TODO: Overried this function
    function getLiquidityWETH9() external view returns(uint256);

    // TODO: Overried this function
    function getLiquidityToken() external view returns(uint256);

    // EXECUTING FUNCTIONS
    function listInDex() external returns (address);

    function investPool(uint256 amount) external;

    function joinWhitelist() external;

    function redeemToken() external;

    function refundToken() external;
}
