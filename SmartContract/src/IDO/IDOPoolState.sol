//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IIDOPoolState} from "../interfaces/IIDOPoolState.sol";

contract IDOPoolState is IIDOPoolState{
    uint8 public constant RATE_DECIMALS = uint8(4);

    uint112 public constant MIN_DELAY_STARTING = uint112(10 * 60 * 60); // 10 minutes

    uint112 public constant MIN_PRIVATE_SALES_ENDING = uint112(5 * 60 * 60); // 5 minutes

    uint256 public constant MIN_PRICE_TOKEN = 10 ** 15; // MIN: 1 token = 0.001 WETH

    uint256 public constant MIN_WETH = 1 ether;

    address public immutable AOI_DEX_FACTORY;

    address public immutable AOI_DEX_ROUTER;

    address public immutable WETH;

    bytes32 public WHITELISTED; // Added by pool owner through uploading the list of whitelisted addresses.

    address public POOL_OWNER;

    bool internal hasListedDex;

    bool internal initialized;

    bool internal hasWithdrawn;

    mapping(address => bool) public registers;

    constructor(
        address _WETH,
        address _AOI_DEX_FACTORY,
        address _AOI_DEX_ROUTER
    ) {
        WETH = _WETH;
        AOI_DEX_FACTORY = _AOI_DEX_FACTORY;
        AOI_DEX_ROUTER = _AOI_DEX_ROUTER;
    }
}
