//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IDOFactoryState {
    address public immutable AOI_DEX_FACTORY;

    address public immutable AOI_DEX_ROUTER;

    address public immutable WETH;

    uint16 public constant IDO_FEE_RATE = uint16(500); // 0.05 % = 500 / 10^4

    bytes32 public constant EMPTY_MERKLE_ROOT = bytes32(0);

    uint256 internal totalPool = 1;

    constructor(address _aoiFactory, address _aoiRouter, address _WETH) {
        AOI_DEX_FACTORY = _aoiFactory;
        AOI_DEX_ROUTER = _aoiRouter;
        WETH = _WETH;
    }
}
