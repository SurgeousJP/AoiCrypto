//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/BaseTest.sol";
import {console, console2} from "@forge-std/Test.sol";
import {MockERC20} from "./mock/MockERC20.sol";

import {IIDOPoolState} from "../src/interfaces/IIDOPoolState.sol";
import {IIDOFactoryState} from "../src/interfaces/IIDOFactoryState.sol";
import {IDOPool} from "../src/IDO/IDOPool.sol";
import {IIDOPool} from "../src/interfaces/IIDOPool.sol";
import {IIDOFactory} from "../src/interfaces/IIDOFactory.sol";
import {IAoiERC20} from "../src/interfaces/DEX/IAoiERC20.sol";
import {AoiPair} from "../src/DEX/AoiPair.sol";
import {IAoiPair} from "../src/interfaces/DEX/IAoiPair.sol";

import "@openzeppelin/contracts/utils/math/Math.sol";
import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";

contract IDOFactoryTest is BaseTest {
    using FixedPointMathLib for uint256;

    IDOPool public idoPool;
    MockERC20 public mockERC20;
    address[] investors;

    function setUp() public override {
        super.setUp();
        mockERC20 = new MockERC20();
        // Similating investment
        for (uint256 i = 0; i < 100; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }
    }

    function test_chooseOptimizedParameters() public {
        address investor = makeAddr("investor");
        MockERC20 tokenSale = new MockERC20();
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(tokenSale),
            pricePerToken: 1000000000000000,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 1000000000000000,
            hardCap: 10000000000000000,
            minInvest: 100000000000000,
            maxInvest: 1000000000000000,
            liquidityWETH9: 10000000000000000,
            liquidityToken: 100000000000000000000,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: 1733595177,
            endTime: 1733767977,
            startPublicSale: 0
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        tokenSale.mint(investor, tokenAmountInHardCap + poolDetail.liquidityToken);
        console.log("Token: ", tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.deal(investor, poolDetail.hardCap + poolDetail.liquidityWETH9);
        console.log("ETH: ", poolDetail.hardCap + poolDetail.liquidityWETH9);
        vm.startPrank(investor);
        tokenSale.approve(address(idoFactory), type(uint256).max);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        idoPool = IDOPool(idoPoolAddress);

        uint256 poolId = idoFactory.getTotalPool();
        console.log(poolId);
        console.log(action);
    }

    function test_createNewPublicIDOPoolSuccessful() public {
        uint256 startTime = block.timestamp + MIN_DELAY_STARTING;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        idoPool = IDOPool(idoPoolAddress);

        uint256 poolId = idoFactory.getTotalPool();
        // Assert
        assert(poolId == 1);
        assert(address(idoPool) == idoFactory.getIdoPoolAddress(poolId));
        assert(idoFactory.checkPoolIsValid(poolId) == true);

        assert(idoPool.getPoolTokenAddress() == address(mockERC20));
        assert(idoPool.getPricePerToken() == poolDetail.pricePerToken);
        assert(idoPool.getPoolStartTime() == poolTime.startTime);
        assert(idoPool.getPoolEndTime() == poolTime.endTime);
        assert(idoPool.getPoolRaisedAmount() == 0);
        assert(idoPool.getPoolTokenAmount() == 0);
        assert(idoPool.getPoolSoftCap() == poolDetail.softCap);
        assert(idoPool.getPoolHardCap() == poolDetail.hardCap);
        assert(idoPool.getPoolMinInvest() == poolDetail.minInvest);
        assert(idoPool.getPoolMaxInvest() == poolDetail.maxInvest);
        assert(idoPool.getLiquidityWETH9Amount() == poolDetail.liquidityWETH9);
        assert(idoPool.getLiquidityTokenAmount() == poolDetail.liquidityToken);
        assert(idoPool.getPoolOwner() == addr1);
        // Check balance of ether and token
        uint256 tokenBalance = mockERC20.balanceOf(address(idoPool));
        uint256 ethBalance = address(idoPool).balance;
        assert(ethBalance == poolDetail.liquidityWETH9);
        assert(
            tokenBalance == tokenAmountInHardCap + poolDetail.liquidityToken
        );
        assert(
            (tokenBalance - poolDetail.liquidityToken).divWad(
                poolDetail.hardCap
            ) == poolDetail.pricePerToken
        );
        assert(
            (tokenBalance - poolDetail.liquidityToken).divWad(
                poolDetail.pricePerToken
            ) == poolDetail.hardCap
        );
    }

    function test_createNewPublicIDOPoolErrorMinDelayStarting() public {
        uint256 startTime = block.timestamp + MIN_DELAY_STARTING - 10;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        vm.expectRevert(IIDOPoolState.InvalidPoolDelayTime.selector);
        idoFactory.createPool{value: poolDetail.liquidityWETH9}(
            poolDetail,
            poolTime,
            false,
            EMPTY_ROOT,
            action,
            lockExpired
        );
    }

    function test_createNewPublicIDOPoolErrorEndTime() public {
        uint256 startTime = block.timestamp + MIN_DELAY_STARTING;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: 0,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        vm.expectRevert(IIDOPoolState.InvalidPoolTimeFrame.selector);
        idoFactory.createPool{value: poolDetail.liquidityWETH9}(
            poolDetail,
            poolTime,
            false,
            EMPTY_ROOT,
            action,
            lockExpired
        );
    }

    function test_createNewPublicIDOPoolErrorMaxInvestLargerThanHardCap(
        uint256 hardCap
    ) public {
        uint256 startTime = block.timestamp + MIN_DELAY_STARTING;
        uint256 maxInvest = 0;
        hardCap = bound(hardCap, 3, 10_000);
        maxInvest = bound(maxInvest, hardCap, 20_000);
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 1,
            hardCap: hardCap,
            minInvest: 1,
            maxInvest: maxInvest,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        vm.expectRevert(IIDOPoolState.InvalidPoolMaxInvestment.selector);
        idoFactory.createPool{value: poolDetail.liquidityWETH9}(
            poolDetail,
            poolTime,
            false,
            EMPTY_ROOT,
            action,
            lockExpired
        );
    }

    function test_listInDexSuccessfullyWithFullHardCap() public {
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        uint256 lpToken0Amount = 10_000_000 ether;
        uint256 lpETHAmount = 2 ether;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: lpETHAmount,
            liquidityToken: lpToken0Amount,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        assert(idoFactory.getTotalPool() == 0);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        vm.stopPrank();
        assert(idoFactory.getTotalPool() == 1);
        idoPool = IDOPool(idoPoolAddress);
        vm.warp(startTime);

        bytes32[] memory proof;

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPool{value: poolDetail.maxInvest}(proof);
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() == poolDetail.hardCap);

        // Calculate the expected lp amount
        uint256 lpAmountExpected = Math.sqrt(lpToken0Amount * lpETHAmount) -
            MINIMUM_LIQUIDITY;

        // Skip to end IDO for listing
        vm.warp(poolTime.endTime);

        // Listing DEX
        vm.prank(addr1);
        (address liquidityPoolAddress, uint256 lpAmount) = idoFactory
            .depositLiquidityPool(1);

        // Check after deposit
        IAoiPair lpPair = IAoiPair(liquidityPoolAddress);
        assert(lpPair.token0() == address(mockERC20));
        assert(lpPair.token1() == address(WETH));
        assert(lpAmountExpected == lpAmount);
        (uint256 reserve0, uint256 reserve1, ) = lpPair.getReserves();
        assert(reserve0 == poolDetail.liquidityToken);
        assert(reserve1 == poolDetail.liquidityWETH9);
    }

    function test_listInDexSuccessfullyWithLockLpToken() public {
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        uint256 lpToken0Amount = 10_000_000 ether;
        uint256 lpETHAmount = 2 ether;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: lpETHAmount,
            liquidityToken: lpToken0Amount,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .LOCK;
        uint256 lockExpired = startTime + 2 weeks;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        assert(idoFactory.getTotalPool() == 0);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        vm.stopPrank();
        assert(idoFactory.getTotalPool() == 1);
        idoPool = IDOPool(idoPoolAddress);
        vm.warp(startTime);
        // Similating investment
        for (uint256 i = 0; i < 100; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }

        bytes32[] memory proof;

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPool{value: poolDetail.maxInvest}(proof);
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() == poolDetail.hardCap);

        // Calculate the expected lp amount
        uint256 lpAmountExpected = Math.sqrt(lpToken0Amount * lpETHAmount) -
            MINIMUM_LIQUIDITY;

        // Skip to end IDO for listing
        vm.warp(poolTime.endTime);

        // Listing DEX
        vm.prank(addr1);
        (address liquidityPoolAddress, uint256 lpAmount) = idoFactory
            .depositLiquidityPool(1);

        // Check after deposit
        assert(idoFactory.getLpAmount(1) == lpAmountExpected);
        IAoiPair lpPair = IAoiPair(liquidityPoolAddress);
        assert(lpPair.token0() == address(mockERC20));
        assert(lpPair.token1() == address(WETH));
        assert(lpAmountExpected == lpAmount);
        (uint256 reserve0, uint256 reserve1, ) = lpPair.getReserves();
        assert(reserve0 == poolDetail.liquidityToken);
        assert(reserve1 == poolDetail.liquidityWETH9);
        IAoiERC20 lpPairERC20 = IAoiERC20(liquidityPoolAddress);

        // Skip locked Time
        vm.warp(lockExpired + 2);

        assert(IAoiERC20(liquidityPoolAddress).balanceOf(addr1) == 0);
        assert(
            IAoiERC20(liquidityPoolAddress).balanceOf(address(idoFactory)) ==
                lpAmountExpected
        );
        // Unlock lp token
        vm.prank(addr1);
        idoFactory.receiveLpToken(1);

        assert(
            IAoiERC20(liquidityPoolAddress).balanceOf(address(idoFactory)) == 0
        );
        assert(
            IAoiERC20(liquidityPoolAddress).balanceOf(addr1) == lpAmountExpected
        );
    }

    function test_listInDexSuccessfullyWithBurnLpToken() public {
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        uint256 lpToken0Amount = 10_000_000 ether;
        uint256 lpETHAmount = 2 ether;
        uint256 softCap = 5 ether;
        uint256 hardCap = 10 ether;
        uint256 minInvest = 0.05 ether;
        uint256 maxInvest = minInvest * 2;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: softCap,
            hardCap: hardCap,
            minInvest: minInvest,
            maxInvest: maxInvest,
            liquidityWETH9: lpETHAmount,
            liquidityToken: lpToken0Amount,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .BURN;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        assert(idoFactory.getTotalPool() == 0);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        vm.stopPrank();
        assert(idoFactory.getTotalPool() == 1);
        idoPool = IDOPool(idoPoolAddress);
        vm.warp(startTime);
        // Similating investment
        for (uint256 i = 0; i < 100; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }

        bytes32[] memory proof;

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPool{value: poolDetail.maxInvest}(proof);
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() == poolDetail.hardCap);

        // Calculate the expected lp amount
        uint256 lpAmountExpected = Math.sqrt(lpToken0Amount * lpETHAmount) -
            MINIMUM_LIQUIDITY;

        // Skip to end IDO for listing
        vm.warp(poolTime.endTime);

        // Listing DEX
        vm.prank(addr1);
        (address liquidityPoolAddress, uint256 lpAmount) = idoFactory
            .depositLiquidityPool(1);

        // Check after deposit
        assert(idoFactory.getLpAmount(1) == lpAmountExpected);
        IAoiPair lpPair = IAoiPair(liquidityPoolAddress);
        assert(lpPair.token0() == address(mockERC20));
        assert(lpPair.token1() == address(WETH));
        assert(lpAmountExpected == lpAmount);
        (uint256 reserve0, uint256 reserve1, ) = lpPair.getReserves();
        assert(reserve0 == poolDetail.liquidityToken);
        assert(reserve1 == poolDetail.liquidityWETH9);
        IAoiERC20 lpPairERC20 = IAoiERC20(liquidityPoolAddress);
        assert(lpPairERC20.balanceOf(addr1) == 0);
        assert(lpPairERC20.balanceOf(address(idoFactory)) == 0);

        // Unlock lp token - Should be reverted
        vm.startPrank(addr1);
        vm.expectRevert(IIDOFactoryState.LiquidityIsNotLocked.selector);
        idoFactory.receiveLpToken(1);
        vm.stopPrank();
    }

    function test_listInDexSuccessfullyWithReachedSoftCap() public {
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        uint256 lpToken0Amount = 10_000_000 ether;
        uint256 lpETHAmount = 2 ether;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: lpETHAmount,
            liquidityToken: lpToken0Amount,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        assert(idoFactory.getTotalPool() == 0);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        vm.stopPrank();
        assert(idoFactory.getTotalPool() == 1);
        idoPool = IDOPool(idoPoolAddress);
        vm.warp(startTime);
        // Similating investment
        for (uint256 i = 0; i < 100; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }

        bytes32[] memory proof;

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPool{value: poolDetail.maxInvest}(proof);
            if (idoPool.getPoolRaisedAmount() >= idoPool.getPoolSoftCap()) {
                break; // Ensuring only reaching soft cap
            }
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() >= idoPool.getPoolSoftCap());

        // Calculate the expected lp amount
        uint256 lpAmountExpected = Math.sqrt(lpToken0Amount * lpETHAmount) -
            MINIMUM_LIQUIDITY;

        // Skip to end IDO for listing
        vm.warp(poolTime.endTime);

        // Listing DEX
        vm.prank(addr1);
        (address liquidityPoolAddress, uint256 lpAmount) = idoFactory
            .depositLiquidityPool(1);

        // Check after deposit
        assert(idoFactory.getLpAmount(1) == lpAmountExpected);
        IAoiPair lpPair = IAoiPair(liquidityPoolAddress);
        assert(lpPair.token0() == address(mockERC20));
        assert(lpPair.token1() == address(WETH));
        assert(lpAmountExpected == lpAmount);
        (uint256 reserve0, uint256 reserve1, ) = lpPair.getReserves();
        assert(reserve0 == poolDetail.liquidityToken);
        assert(reserve1 == poolDetail.liquidityWETH9);
        IAoiERC20 lpPairERC20 = IAoiERC20(liquidityPoolAddress);
        assert(lpPairERC20.balanceOf(addr1) == lpAmountExpected);
        assert(lpPairERC20.balanceOf(address(idoFactory)) == 0);
    }

    function test_listInDexFailedWithNotEnd() public {
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        uint256 lpToken0Amount = 10_000_000 ether;
        uint256 lpETHAmount = 2 ether;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: lpETHAmount,
            liquidityToken: lpToken0Amount,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        assert(idoFactory.getTotalPool() == 0);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        vm.stopPrank();
        assert(idoFactory.getTotalPool() == 1);
        idoPool = IDOPool(idoPoolAddress);
        vm.warp(startTime);
        // Similating investment
        for (uint256 i = 0; i < 100; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }

        bytes32[] memory proof;

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            if (
                idoPool.getPoolRaisedAmount() + poolDetail.maxInvest >=
                idoPool.getPoolSoftCap()
            ) {
                break; // Ensuring only reaching soft cap
            }
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPool{value: poolDetail.maxInvest}(proof);
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() < idoPool.getPoolSoftCap());

        // Calculate the expected lp amount
        uint256 lpAmountExpected = Math.sqrt(lpToken0Amount * lpETHAmount) -
            MINIMUM_LIQUIDITY;

        // Listing DEX
        vm.prank(addr1);
        vm.expectRevert(IIDOPoolState.IDOIsNotEnded.selector);
        (address liquidityPoolAddress, uint256 lpAmount) = idoFactory
            .depositLiquidityPool(1);
    }

    function test_listInDexFailedWithNotReachedSoftCap() public {
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        uint256 lpToken0Amount = 10_000_000 ether;
        uint256 lpETHAmount = 2 ether;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: lpETHAmount,
            liquidityToken: lpToken0Amount,
            privateSaleAmount: 0
        });
        IIDOPool.IDOTime memory poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: startTime + 1 weeks,
            startPublicSale: startTime + 1 days
        });
        uint256 tokenAmountInHardCap = poolDetail.hardCap.mulWad(
            poolDetail.pricePerToken
        );
        IIDOFactory.LiquidityPoolAction action = IIDOFactory
            .LiquidityPoolAction
            .NOTHING;
        uint256 lockExpired = 0;

        require(addr1.balance > poolDetail.hardCap + poolDetail.liquidityWETH9);

        mockERC20.mint(addr1, tokenAmountInHardCap + poolDetail.liquidityToken);
        vm.startPrank(addr1);
        mockERC20.approve(address(idoFactory), type(uint256).max);
        assert(idoFactory.getTotalPool() == 0);
        address payable idoPoolAddress = payable(
            idoFactory.createPool{value: poolDetail.liquidityWETH9}(
                poolDetail,
                poolTime,
                false,
                EMPTY_ROOT,
                action,
                lockExpired
            )
        );
        vm.stopPrank();
        assert(idoFactory.getTotalPool() == 1);
        idoPool = IDOPool(idoPoolAddress);
        vm.warp(startTime);
        // Similating investment
        for (uint256 i = 0; i < 100; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }

        bytes32[] memory proof;

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            if (
                idoPool.getPoolRaisedAmount() + poolDetail.maxInvest >=
                idoPool.getPoolSoftCap()
            ) {
                break; // Ensuring only reaching soft cap
            }
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPool{value: poolDetail.maxInvest}(proof);
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() < idoPool.getPoolSoftCap());

        // Calculate the expected lp amount
        uint256 lpAmountExpected = Math.sqrt(lpToken0Amount * lpETHAmount) -
            MINIMUM_LIQUIDITY;

        // Skip to end IDO for listing
        vm.warp(poolTime.endTime);

        // Listing DEX
        vm.prank(addr1);
        vm.expectRevert(IIDOPoolState.SoftCapNotReached.selector);
        (address liquidityPoolAddress, uint256 lpAmount) = idoFactory
            .depositLiquidityPool(1);
    }
}
