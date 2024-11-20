//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {IDOPool} from "../src/IDO/IDOPool.sol";
import {IIDOPool} from "../src/interfaces/IIDOPool.sol";

contract IDOPoolTest is Test {
    bytes32 public constant EMPTY_ROOT = bytes32(0);
    IDOPool public idoPool;
    address public owner;

    function setUp() public {
        owner = makeAddr("owner");
        vm.prank(owner);
        // idoPool = new IDOPool()
    }
}
