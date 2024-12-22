//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/BaseTest.sol";
import {console, console2} from "@forge-std/Test.sol";
import {MockERC20} from "./mock/MockERC20.sol";

import {IERC20FactoryState} from "../src/interfaces/IERC20FactoryState.sol";
import {ERC20Factory} from "../src/Token/ERC20Factory.sol";
import {AoiERC20} from "../src/Token/CustomAoiERC20.sol";
import {IAoiPair} from "../src/interfaces/DEX/IAoiPair.sol";

contract AoiFactoryTest is BaseTest {
    function setUp() public override {
        super.setUp();
    }

    function test_createPairToken() public {
        MockERC20 token0 = new MockERC20();
        MockERC20 token1 = new MockERC20();

        vm.prank(addr1);
        address pair = aoiFactory.createPair(address(token0), address(token1));

        assertEq(aoiFactory.getPair(address(token0), address(token1)), pair);
        assertEq(aoiFactory.getPair(address(token0), address(token1)), aoiFactory.getPair(address(token1), address(token0)));
    }

    function test_addLiquidityPairToken() public {
        MockERC20 token0 = new MockERC20();
        MockERC20 token1 = new MockERC20();

        vm.prank(addr1);
        address pair = aoiFactory.createPair(address(token0), address(token1));

        assertEq(aoiFactory.getPair(address(token0), address(token1)), pair);
        assertEq(aoiFactory.getPair(address(token0), address(token1)), aoiFactory.getPair(address(token1), address(token0)));

        uint256 liquidityToken = 10 ether;
        token0.mint(addr1, liquidityToken);
        token1.mint(addr1, liquidityToken);
        vm.startPrank(addr1);
        token0.approve(address(aoiRouter), type(uint256).max);
        token1.approve(address(aoiRouter), type(uint256).max);
        aoiRouter.addLiquidity(address(token0), address(token1), liquidityToken, liquidityToken, liquidityToken, liquidityToken, addr1, block.timestamp);
        vm.stopPrank();
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IAoiPair(pair).getReserves();
        assertEq(reserve0, liquidityToken);
        assertEq(reserve1, liquidityToken);
        assertEq(blockTimestampLast, block.timestamp);
    }

    function test_createPairETH() public {
        MockERC20 token0 = new MockERC20();

        vm.prank(addr1);
        address pair = aoiFactory.createPair(address(token0), address(WETH));

        assertEq(aoiFactory.getPair(address(token0), address(WETH)), pair);
        assertEq(aoiFactory.getPair(address(token0), address(WETH)), aoiFactory.getPair(address(WETH), address(token0)));

        uint256 liquidityToken = 100 ether;
        uint256 liquidityWETH = 10 ether;
        vm.startPrank(addr1);
        token0.mint(addr1, liquidityToken);
        token0.approve(address(aoiRouter), type(uint256).max);
        aoiRouter.addLiquidityETH{value: liquidityWETH}(address(token0), liquidityToken, liquidityToken, liquidityWETH, addr1, block.timestamp);
        vm.stopPrank();

        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IAoiPair(pair).getReserves();
        assertEq(reserve0, liquidityToken);
        assertEq(reserve1, liquidityWETH);
        assertEq(blockTimestampLast, block.timestamp);
    }

    function test_swapPairToken() public {
        MockERC20 token0 = new MockERC20();
        MockERC20 token1 = new MockERC20();

        vm.prank(addr1);
        address pair = aoiFactory.createPair(address(token0), address(token1));

        assertEq(aoiFactory.getPair(address(token0), address(token1)), pair);
        assertEq(aoiFactory.getPair(address(token0), address(token1)), aoiFactory.getPair(address(token1), address(token0)));

        uint256 liquidityToken = 10 ether;
        token0.mint(addr1, liquidityToken);
        token1.mint(addr1, liquidityToken);
        vm.startPrank(addr1);
        token0.approve(address(aoiRouter), type(uint256).max);
        token1.approve(address(aoiRouter), type(uint256).max);
        aoiRouter.addLiquidity(address(token0), address(token1), liquidityToken, liquidityToken, liquidityToken, liquidityToken, addr1, block.timestamp);
        vm.stopPrank();
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IAoiPair(pair).getReserves();
        assertEq(reserve0, liquidityToken);
        assertEq(reserve1, liquidityToken);
        assertEq(blockTimestampLast, block.timestamp);

        uint256 balanceToken1Before = token1.balanceOf(addr2);
        uint256 amountToken0 = 1 ether;
        vm.startPrank(addr2);
        token0.mint(addr2, amountToken0);
        token0.approve(address(aoiRouter), type(uint256).max);
        uint256 amountOut = aoiRouter.getAmountOut(amountToken0, reserve0, reserve1);
        address[] memory path = new address[](2);
        path[0] = address(token0);
        path[1] = address(token1);
        aoiRouter.swapExactTokensForTokens(amountToken0, amountOut, path, addr2, block.timestamp);
        vm.stopPrank();

        assert(balanceToken1Before < token1.balanceOf(addr2));
    }

    function test_swapPairETH() public {
        MockERC20 token0 = new MockERC20();

        vm.prank(addr1);
        address pair = aoiFactory.createPair(address(token0), address(WETH));

        assertEq(aoiFactory.getPair(address(token0), address(WETH)), pair);
        assertEq(aoiFactory.getPair(address(token0), address(WETH)), aoiFactory.getPair(address(WETH), address(token0)));

        uint256 liquidityToken = 100 ether;
        uint256 liquidityWETH = 10 ether;
        vm.startPrank(addr1);
        token0.mint(addr1, liquidityToken);
        token0.approve(address(aoiRouter), type(uint256).max);
        aoiRouter.addLiquidityETH{value: liquidityWETH}(address(token0), liquidityToken, liquidityToken, liquidityWETH, addr1, block.timestamp);
        vm.stopPrank();

        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IAoiPair(pair).getReserves();
        assertEq(reserve0, liquidityToken);
        assertEq(reserve1, liquidityWETH);
        assertEq(blockTimestampLast, block.timestamp);

        uint256 ethToSwap = 1 ether;
        uint256 balanceToken0Before = token0.balanceOf(addr2);
        uint256 balanceETHBefore = addr2.balance;
        vm.startPrank(addr2);
        uint256 amountOut = aoiRouter.getAmountOut(ethToSwap, reserve1, reserve0);
        address[] memory path = new address[](2);
        path[0] = address(WETH);
        path[1] = address(token0);
        aoiRouter.swapExactETHForTokens{value: ethToSwap}(amountOut, path, addr2, block.timestamp);
        vm.stopPrank();

        assert(balanceToken0Before <= token0.balanceOf(addr2));
        assert(balanceETHBefore >= addr2.balance);
    }
}