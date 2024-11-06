//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AoiPool.sol";
import "../interfaces/IAoiPoolDeployer.sol";

contract AoiPoolDeployer is IAoiPoolDeployer {
    struct Parameters {
        address factory;
        address token0;
        address token1;
        uint24 fee;
        int24 tickSpacing;
    }

    Parameters public override parameters;

    function _deploy(
        address factory,
        address token0,
        address token1,
        uint24 fee,
        int24 tickSpacing
    ) internal returns (address pool) {
        parameters = Parameters(factory, token0, token1, fee, tickSpacing);
        pool = address(new AoiPool(keccak256(abi.encode(token0, token1, fee))));
        delete parameters;
    }
}
