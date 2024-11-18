//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/BaseTest.sol";
// import {Vm} from "@forge-std/Vm.sol";
import {MockERC20} from "./mock/MockERC20.sol";
import {IDOPool} from "../src/IDO/IDOPool.sol";
import {IIDOPool} from "../src/interfaces/IIDOPool.sol";
import {IIDOFactory} from "../src/interfaces/IIDOFactory.sol";

import {AoiPair} from "../src/DEX/AoiPair.sol";
import {IAoiPair} from "../src/interfaces/DEX/IAoiPair.sol";

import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";

contract IDOFactoryTest is BaseTest {
    using FixedPointMathLib for uint256;

    IDOPool public idoPool;
    MockERC20 public mockERC20;
    address[] investors;

    function setUp() public override {
        super.setUp();
        mockERC20 = new MockERC20();
    }

    function test_createNewPublicIDOPoolSuccessful() public {
        uint256 startTime = block.timestamp + MIN_DELAY_STARTING;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            startTime: startTime,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            endTime: startTime + 1 weeks,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            whitelistedRoot: EMPTY_ROOT
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
        assert(idoPool.getPoolStartTime() == poolDetail.startTime);
        assert(idoPool.getPoolEndTime() == poolDetail.endTime);
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
            startTime: startTime,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            endTime: startTime + 1 weeks,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            whitelistedRoot: EMPTY_ROOT
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
        vm.expectRevert();
        idoFactory.createPool{value: poolDetail.liquidityWETH9}(
            poolDetail,
            action,
            lockExpired
        );
    }

    function test_createNewPublicIDOPoolErrorEndTime() public {
        uint256 startTime = block.timestamp + MIN_DELAY_STARTING;
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            startTime: startTime,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            endTime: 0,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            whitelistedRoot: EMPTY_ROOT
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
        vm.expectRevert();
        idoFactory.createPool{value: poolDetail.liquidityWETH9}(
            poolDetail,
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
            startTime: startTime,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            endTime: startTime + 1 weeks,
            softCap: 1,
            hardCap: hardCap,
            minInvest: 1,
            maxInvest: maxInvest,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            whitelistedRoot: EMPTY_ROOT
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
        vm.expectRevert();
        idoFactory.createPool{value: poolDetail.liquidityWETH9}(
            poolDetail,
            action,
            lockExpired
        );
    }

    function test_listInDexSuccesfullyWithFullHardCap() public {
        // bytes memory bytecode = type(AoiPair).creationCode;
        // console.log(
        //     hex"96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
        // );
        // console.log(vm.toString(bytecode));
        uint256 startTime = block.timestamp + uint256(MIN_DELAY_STARTING);
        IIDOPool.IDOPoolDetails memory poolDetail = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            pricePerToken: 0.001 ether,
            startTime: startTime,
            raisedAmount: 0,
            raisedTokenAmount: 0,
            endTime: startTime + 1 weeks,
            softCap: 5 ether,
            hardCap: 10 ether,
            minInvest: 0.05 ether,
            maxInvest: 0.1 ether,
            liquidityWETH9: 2 ether,
            liquidityToken: 10_000_000 ether,
            whitelistedRoot: EMPTY_ROOT
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

        // Investing
        for (uint256 i = 0; i < 100; i++) {
            address investor = investors[i];
            vm.prank(investor);
            idoPool.investPublicPool{value: poolDetail.maxInvest}();
        }

        // Check fullhard cap
        assert(idoPool.getPoolRaisedAmount() == poolDetail.hardCap);
        // Listing DEX
        console.log(tokenAmountInHardCap);
        console.log(poolDetail.liquidityToken);
        console.log(poolDetail.liquidityWETH9);
        vm.prank(addr1);
        console.log(address(idoFactory));
        address liquidityPoolAddress = idoFactory.depositLiquidityPool(1);

        console.log(liquidityPoolAddress);

        // Check after deposit
        IAoiPair lpPair = IAoiPair(liquidityPoolAddress);
        assert(lpPair.token0() == address(mockERC20));
        assert(lpPair.token1() == address(WETH));
        (uint256 reserve0, uint256 reserve1, ) = lpPair.getReserves();
        assert(reserve0 == poolDetail.liquidityToken);
        assert(reserve1 == poolDetail.liquidityWETH9);
    }
}
