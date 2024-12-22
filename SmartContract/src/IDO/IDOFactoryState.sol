//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOFactoryState} from "../interfaces/IIDOFactoryState.sol";

contract IDOFactoryState is IIDOFactoryState {
    uint16 public constant IDO_FEE_RATE = uint16(500); // 0.05 % = 500 / 10^4

    uint256 public constant MIN_LOCKED_DURATION = uint256(24 * 60 * 60); // 1 day

    bytes32 public constant EMPTY_MERKLE_ROOT = bytes32(0);

    address public AOI_DEX_FACTORY;

    address public AOI_DEX_ROUTER;

    address public WETH;

    uint256 internal totalPool = 1;

    constructor(address _aoiFactory, address _aoiRouter, address _WETH) {
        AOI_DEX_FACTORY = _aoiFactory;
        AOI_DEX_ROUTER = _aoiRouter;
        WETH = _WETH;
    }
}
