//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {IDOFactory} from "../../src/IDO/IDOFactory.sol";

import {MockUniswapV3Factory} from "../mock/MockUniswapV3Factory.sol";

abstract contract BaseTest is Test {
    IDOFactory internal idoFactory;
    MockUniswapV3Factory internal uniswapV3Factory;

    constructor() {}

    function setUp() public virtual {
        uniswapV3Factory = new MockUniswapV3Factory();
        idoFactory = new IDOFactory(address(uniswapV3Factory));
    }
}
