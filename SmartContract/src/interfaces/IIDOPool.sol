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
        uint256 raisedAmount;
        uint256 raisedTokenAmount;
        uint256 softCap;
        uint256 hardCap;
        uint256 minInvest;
        uint256 maxInvest;
        uint256 liquidityWETH9;
        uint256 liquidityToken;
        uint256 privateSaleAmount;
    }

    struct IDOTime {
        uint256 startTime;
        uint256 endTime;
        uint256 startPublicSale; // only PrivateSale or only PublicSale if being equal 0
    }

    struct Investor {
        uint256 depositedAmount;
        uint256 tokenAmount;
        bool claimed; // use in both claimToken and refundToken
    }

    // VIEW FUNCTIONS

    function getPoolDetails() external view returns (IDOPoolDetails memory);

    function getPoolTime() external view returns (IDOTime memory);

    function getPoolRaisedAmount() external view returns (uint256);

    function getPoolSoftCap() external view returns (uint256);

    function isRegistered(address _address) external view returns (bool);

    function getPoolMinInvest() external view returns (uint256);

    function getPoolMaxInvest() external view returns (uint256);

    function isPoolActive() external view returns (bool);

    function getTimeLeftEnding() external view returns (uint256);

    function getUserDepositAmount(
        address _address
    ) external view returns (uint256);

    function getPoolOwner() external view returns (address);

    function getPoolStartTime() external view returns (uint256);

    function getPoolEndTime() external view returns (uint256);

    function getPoolSoftCapReached() external view returns (bool);

    function getPricePerToken() external view returns (uint256);

    function getLiquidityWETH9Amount() external view returns (uint256);

    function getLiquidityTokenAmount() external view returns (uint256);

    function getPoolHardCap() external view returns (uint256);

    function getPoolTokenAddress() external view returns (address);

    function getPoolTokenAmount() external view returns (uint256);

    function getPoolType() external view returns (IDOType);

    function getHasListedDex() external view returns (bool);

    // EXECUTION FUNCTIONS

    function initialize(
        IDOPoolDetails memory _poolDetails,
        IDOTime memory _poolTime,
        address _POOL_OWNER,
        bytes32 _WHITELISTED, // Allows to be default value
        bool _PRIVATE_SALE
    ) external;

    function listInDex(address to) external returns (address, uint256);

    function investPool(bytes32[] memory proof) external payable;

    function registerPrivatePool() external;

    function cancelRegisterPrivatePool() external;

    function cancelInvestment() external;

    function claimToken() external;

    function refundToken() external;

    function withdrawRemainingToken() external payable;
}
