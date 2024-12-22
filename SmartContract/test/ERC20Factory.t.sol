//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console, console2} from "lib/forge-std/src/Test.sol";

import {IERC20FactoryState} from "../src/interfaces/IERC20FactoryState.sol";
import {ERC20Factory} from "../src/Token/ERC20Factory.sol";
import {AoiERC20} from "../src/Token/CustomAoiERC20.sol";

contract ERC20FactoryTest is Test {

    ERC20Factory public erc20Factory;

    address public owner = makeAddr("owner");
    
    function setUp() public virtual {
        vm.prank(owner);
        erc20Factory = new ERC20Factory();
    }

    function test_createERC20Successfully(
        string memory name,
        string memory symbol,
        uint256 maxTotalSupply,
        uint256 initialSupply
    ) public {
        maxTotalSupply = bound(maxTotalSupply, 1, type(uint256).max);
        initialSupply = bound(initialSupply, 1, maxTotalSupply);
        address sender = makeAddr("sender");
        vm.prank(sender);
        address tokenAddress = erc20Factory.createNewERC20(name, symbol, maxTotalSupply, initialSupply);

        IERC20FactoryState.Token memory token = erc20Factory.getTokenDetail(0);

        assertEq(token.tokenAddress, tokenAddress);
        assertEq(token.createdTime, block.timestamp);
        assertEq0(bytes(token.symbol), bytes(symbol));
        assertEq0(bytes(token.name), bytes(name));
        assertEq(token.maxSupply, maxTotalSupply);
        assertEq(token.initialSupply, initialSupply);

        AoiERC20 aoiERC20 = AoiERC20(tokenAddress);

        assertEq(aoiERC20.balanceOf(sender), initialSupply);
        assert(aoiERC20.MAX_SUPPLY() == maxTotalSupply);
        assertEq0(bytes(aoiERC20.name()), bytes(name));
        assertEq0(bytes(aoiERC20.symbol()), bytes(symbol));
    }
}