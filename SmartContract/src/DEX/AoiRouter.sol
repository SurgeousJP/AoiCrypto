//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IAoiRouter} from "../interfaces/IAoiRouter.sol";
import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {PeripheryImmutableState} from "./base/PeripheryImmutableState.sol";

import {PoolAddress} from "../library/PoolAddress.sol";
import {Path} from "../library/Path.sol";

contract AoiRouter is IAoiRouter, PeripheryImmutableState {
    using Path for bytes;

    uint256 private constant DEFAULT_AMOUNT_IN_CACHED = type(uint256).max;

    uint256 private amountInCached = DEFAULT_AMOUNT_IN_CACHED;

    constructor(
        address _factory,
        address _WETH9
    ) PeripheryImmutableState(_factory, _WETH9) {}

    function _getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) private view returns (IIDOPool) {
        return
            IIDOPool(
                PoolAddress.computeAddress(
                    factory,
                    PoolAddress.getPoolKey(tokenA, tokenB, fee)
                )
            );
    }

    struct SwapCallbackData {
        bytes path;
        address payer;
    }

    function aoiSwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata _data
    ) external override {
        require(amount0Delta > 0 || amount1Delta > 0);
        SwapCallbackData memory data = abi.encode(_data, (SwapCallbackData));
        (address tokenIn, address tokenOut, uint24 fee) = data
            .path
            .decodeFirstPool();
    }
}
