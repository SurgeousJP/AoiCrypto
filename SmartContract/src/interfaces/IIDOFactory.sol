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
        address idoOwner;
        address idoPoolAddress;
        address tokenAddress;
        uint256 tokenAmount;
        uint256 wethAmount;
        uint256 lpAmount;
        address liquidityPoolAddress;
        LiquidityPoolAction action;
        address to;
        uint256 lockExpired;
    }

    // VIEW FUNCTIONS

    function getLiquidityPoolAddress(
        uint256 poolId
    ) external view returns (address);

    function getLpAmount(uint256 poolId) external view returns (uint256);

    function getIdoPoolAddress(uint256 poolId) external view returns (address);

    function getTotalPool() external view returns (uint256);

    function checkPoolIsValid(uint256 poolId) external view returns (bool);

    // EXECUTION FUNCTIONS

    function createPool(
        IIDOPool.IDOPoolDetails memory poolDetails,
        IIDOPool.IDOTime memory poolTime,
        bool privateSale,
        bytes32 whitelisted,
        LiquidityPoolAction action,
        uint256 lockExpired
    ) external payable returns (address);

    function depositLiquidityPool(
        uint256 poolId
    ) external returns (address, uint256);

    function receiveLpToken(uint256 poolId) external;
}
