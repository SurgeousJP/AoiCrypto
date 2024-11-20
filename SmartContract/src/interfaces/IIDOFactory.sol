//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOPool} from "../interfaces/IIDOPool.sol";

interface IIDOFactory {
    enum LiquidityPoolAction {
        NOTHING,
        LOCK,
        BURN
    }

    struct LiquidityPool {
        uint256 idoPoolId;
        address idoPoolAddress;
        address tokenAddress;
        uint256 tokenAmount;
        uint256 wethAmount;
        address liquidityPoolAddress;
        LiquidityPoolAction action;
        address to;
        uint256 lockExpired;
    }

    function createPool(
        IIDOPool.IDOPoolDetails memory poolDetails,
        LiquidityPoolAction action,
        uint256 lockExpired
    ) external payable returns (address);

    function depositLiquidityPool(uint256 poolId) external returns (address);

    // VIEW FUNCTIONS

    function getLiquidityPoolAddress(
        uint256 poolId
    ) external view returns (address);

    function getIdoPoolAddress(uint256 poolId) external view returns (address);

    function getTotalPool() external view returns (uint256);

    function checkPoolIsValid(uint256 poolId) external view returns (bool);

    error InvalidPoolId();

    error NotPoolOwner();

    error ActionIsNotNothing();

    error InvalidAction();

    error IdoPoolAlreadyDeposited();

    error InvalidTokenAddress();

    error InvalidPricePerToken();

    error InvalidLockExpired();

    event PoolCreated(
        address indexed owner,
        address indexed tokenAddress,
        uint256 poolId,
        uint256 startTime,
        uint256 endTime
    );

    event PoolDepositedLiquidityPool(
        address indexed liquidityPool,
        uint256 indexed poolId
    );
}
