//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {console, console2} from "@forge-std/Test.sol";

import "./utils/BaseTest.sol";
import {IDOPool} from "../src/IDO/IDOPool.sol";
import {IIDOPoolState} from "../src/interfaces/IIDOPoolState.sol";
import {IIDOPool} from "../src/interfaces/IIDOPool.sol";
import {MockERC20} from "./mock/MockERC20.sol";

import "@openzeppelin/contracts/utils/math/Math.sol";
import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

contract IDOPoolTest is BaseTest {
    using FixedPointMathLib for uint256;
    using SafeTransferLib for address;

    IDOPool public idoPool;
    MockERC20 public mockERC20;
    address[] investors;

    function setUp() public override {
        super.setUp();
        vm.prank(owner);
        mockERC20 = new MockERC20();
        // Similating investment
        for (uint256 i = 0; i < 1000; i++) {
            address investor = makeAddr(string(abi.encode("investor", i)));
            vm.deal(investor, 10 ether);
            investors.push(investor);
        }
    }

    function test_initializeSuccessfully(
        uint256 _pricePerToken,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _minInvest,
        uint256 _maxInvest,
        uint256 _liquidityWETH9,
        uint256 _liquidityToken,
        uint256 _privateSaleAmount,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _startPublicSale
    ) public {
        uint256 liquidityWETH9 = bound(_liquidityWETH9, MIN_WETH, 100 ether);
        vm.deal(owner, liquidityWETH9);
        uint256 maxHardCap = 100 ether;
        uint256 softCap = bound(_softCap, MIN_PRICE_TOKEN, maxHardCap - 1);
        uint256 hardCap = bound(_hardCap, softCap + 1, maxHardCap);
        uint256 pricePerToken = bound(_pricePerToken, MIN_PRICE_TOKEN, 1 ether);
        uint256 tokenAmountInHardCap = hardCap.mulWad(pricePerToken);
        uint256 liquidityToken = bound(
            _liquidityToken,
            0,
            tokenAmountInHardCap * 2
        );
        uint256 minInvest = bound(_minInvest, MIN_PRICE_TOKEN, hardCap - 1);
        vm.assume((hardCap / minInvest) * minInvest >= softCap);
        uint256 maxInvest = bound(_maxInvest, minInvest, hardCap - 1);

        // uint256 maxInvestValue = 100 ether;
        // uint256 minInvest = bound(_minInvest, 1, maxInvestValue - 1);
        // uint256 maxInvest = bound(_maxInvest, minInvest + 1, maxInvestValue);
        // uint256 hardCap = bound(_hardCap, maxInvest, 100 ether);
        // uint256 softCap = bound(_softCap, 1, (hardCap / minInvest) * minInvest);
        // uint256 pricePerToken = bound(_pricePerToken, MIN_PRICE_TOKEN, 1 ether);
        // uint256 tokenAmountInHardCap = hardCap.mulWad(pricePerToken);
        // uint256 liquidityToken = bound(
        //     _liquidityToken,
        //     0,
        //     tokenAmountInHardCap * 2
        // );

        bool _PRIVATE_SALE = false;
        bytes32 _WHITELISTED = EMPTY_ROOT;
        uint256 privateSaleAmount = 0;
        IIDOPool.IDOPoolDetails memory _poolDetails = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            raisedAmount: 0,
            raisedTokenAmount: 0,
            pricePerToken: pricePerToken,
            softCap: softCap,
            hardCap: hardCap,
            minInvest: minInvest,
            maxInvest: maxInvest,
            liquidityWETH9: liquidityWETH9,
            liquidityToken: liquidityToken,
            privateSaleAmount: privateSaleAmount
        });
        uint256 startTime = bound(
            _startTime,
            block.timestamp + MIN_DELAY_STARTING,
            block.timestamp + YEAR - 1
        );
        uint256 endTime = bound(
            _endTime,
            startTime + 1,
            block.timestamp + YEAR
        );
        uint256 startPublicSale = 0;

        IIDOPool.IDOTime memory _poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: endTime,
            startPublicSale: startPublicSale
        });
        vm.startPrank(owner);
        idoPool = new IDOPool(
            address(aoiFactory),
            address(aoiRouter),
            address(WETH)
        );
        mockERC20.mint(
            owner,
            tokenAmountInHardCap + _poolDetails.liquidityToken
        );
        mockERC20.approve(address(idoPool), type(uint256).max);
        idoPool.initialize(
            _poolDetails,
            _poolTime,
            owner,
            _WHITELISTED,
            _PRIVATE_SALE
        );
        vm.stopPrank();

        // Assert
        assert(idoPool.getPoolTokenAddress() == address(mockERC20));
        assert(idoPool.getPricePerToken() == _poolDetails.pricePerToken);
        assert(idoPool.getPoolStartTime() == _poolTime.startTime);
        assert(idoPool.getPoolEndTime() == _poolTime.endTime);
        assert(idoPool.getPoolRaisedAmount() == 0);
        assert(idoPool.getPoolTokenAmount() == 0);
        assert(idoPool.getPoolSoftCap() == _poolDetails.softCap);
        assert(idoPool.getPoolHardCap() == _poolDetails.hardCap);
        assert(idoPool.getPoolMinInvest() == _poolDetails.minInvest);
        assert(idoPool.getPoolMaxInvest() == _poolDetails.maxInvest);
        assert(
            idoPool.getLiquidityWETH9Amount() == _poolDetails.liquidityWETH9
        );
        assert(
            idoPool.getLiquidityTokenAmount() == _poolDetails.liquidityToken
        );
        assert(idoPool.getPoolOwner() == owner);

        // Transfer ETH & IDOToken to IDOPool
        vm.startPrank(owner);
        address(idoPool).safeTransferETH(_poolDetails.liquidityWETH9);
        mockERC20.transfer(
            address(idoPool),
            _poolDetails.liquidityToken + tokenAmountInHardCap
        );
        vm.stopPrank();

        // Transfer Assertion
        uint256 tokenBalance = mockERC20.balanceOf(address(idoPool));
        uint256 ethBalance = address(idoPool).balance;
        assert(ethBalance == _poolDetails.liquidityWETH9);
        assert(
            tokenBalance == tokenAmountInHardCap + _poolDetails.liquidityToken
        );
        // TODO: This assertion is having the precision loss error
        // assert(
        //     (tokenBalance - _poolDetails.liquidityToken).divWad(
        //         _poolDetails.hardCap
        //     ) == _poolDetails.pricePerToken
        // );
        // console.log(
        //     (tokenBalance - _poolDetails.liquidityToken).divWad(
        //         _poolDetails.pricePerToken
        //     )
        // );
        // console.log(_poolDetails.hardCap);
        // assertEqDecimal(
        //     (tokenBalance - _poolDetails.liquidityToken).divWad(
        //         _poolDetails.pricePerToken
        //     ),
        //     _poolDetails.hardCap,
        //     15
        // );
    }

    function test_listInDexSuccessfully(
        uint256 _pricePerToken,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _minInvest,
        uint256 _maxInvest,
        uint256 _liquidityWETH9,
        uint256 _liquidityToken,
        uint256 _privateSaleAmount,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _startPublicSale
    ) public {
        uint256 liquidityWETH9 = bound(_liquidityWETH9, MIN_WETH, 100 ether);
        vm.deal(owner, liquidityWETH9);
        uint256 maxHardCap = 100 ether;
        uint256 softCap = bound(_softCap, MIN_PRICE_TOKEN, maxHardCap - 1);
        uint256 hardCap = bound(_hardCap, softCap + 1, maxHardCap);
        uint256 pricePerToken = bound(_pricePerToken, MIN_PRICE_TOKEN, 1 ether);
        uint256 tokenAmountInHardCap = hardCap.mulWad(pricePerToken);
        uint256 liquidityToken = bound(
            _liquidityToken,
            0,
            tokenAmountInHardCap * 2
        );
        uint256 minInvest = bound(_minInvest, MIN_PRICE_TOKEN, hardCap / 2);
        // require((hardCap / minInvest) * minInvest >= softCap);
        vm.assume((hardCap / minInvest) * minInvest >= softCap);
        uint256 maxInvest = bound(_maxInvest, minInvest, hardCap - 1);

        // uint256 maxInvestValue = 100 ether;
        // uint256 minInvest = bound(_minInvest, 1, maxInvestValue - 1);
        // uint256 maxInvest = bound(_maxInvest, minInvest + 1, maxInvestValue);
        // uint256 hardCap = bound(_hardCap, maxInvest, 100 ether);
        // uint256 softCap = bound(_softCap, 1, (hardCap / minInvest) * minInvest);
        // uint256 pricePerToken = bound(_pricePerToken, MIN_PRICE_TOKEN, 1 ether);
        // uint256 tokenAmountInHardCap = hardCap.mulWad(pricePerToken);
        // uint256 liquidityToken = bound(
        //     _liquidityToken,
        //     0,
        //     tokenAmountInHardCap * 2
        // );

        bool _PRIVATE_SALE = false;
        bytes32 _WHITELISTED = EMPTY_ROOT;
        uint256 privateSaleAmount = 0;
        IIDOPool.IDOPoolDetails memory _poolDetails = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            raisedAmount: 0,
            raisedTokenAmount: 0,
            pricePerToken: pricePerToken,
            softCap: softCap,
            hardCap: hardCap,
            minInvest: minInvest,
            maxInvest: maxInvest,
            liquidityWETH9: liquidityWETH9,
            liquidityToken: liquidityToken,
            privateSaleAmount: privateSaleAmount
        });
        uint256 startTime = bound(
            _startTime,
            block.timestamp + MIN_DELAY_STARTING,
            block.timestamp + YEAR - 1
        );
        uint256 endTime = bound(
            _endTime,
            startTime + 1,
            block.timestamp + YEAR
        );
        uint256 startPublicSale = 0;

        IIDOPool.IDOTime memory _poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: endTime,
            startPublicSale: startPublicSale
        });
        vm.startPrank(owner);
        idoPool = new IDOPool(
            address(aoiFactory),
            address(aoiRouter),
            address(WETH)
        );
        mockERC20.mint(
            owner,
            tokenAmountInHardCap + _poolDetails.liquidityToken
        );
        mockERC20.approve(address(idoPool), type(uint256).max);
        idoPool.initialize(
            _poolDetails,
            _poolTime,
            owner,
            _WHITELISTED,
            _PRIVATE_SALE
        );
        vm.stopPrank();

        // Assert
        assert(idoPool.getPoolTokenAddress() == address(mockERC20));
        assert(idoPool.getPricePerToken() == _poolDetails.pricePerToken);
        assert(idoPool.getPoolStartTime() == _poolTime.startTime);
        assert(idoPool.getPoolEndTime() == _poolTime.endTime);
        assert(idoPool.getPoolRaisedAmount() == 0);
        assert(idoPool.getPoolTokenAmount() == 0);
        assert(idoPool.getPoolSoftCap() == _poolDetails.softCap);
        assert(idoPool.getPoolHardCap() == _poolDetails.hardCap);
        assert(idoPool.getPoolMinInvest() == _poolDetails.minInvest);
        assert(idoPool.getPoolMaxInvest() == _poolDetails.maxInvest);
        assert(
            idoPool.getLiquidityWETH9Amount() == _poolDetails.liquidityWETH9
        );
        assert(
            idoPool.getLiquidityTokenAmount() == _poolDetails.liquidityToken
        );
        assert(idoPool.getPoolOwner() == owner);

        // Transfer ETH & IDOToken to IDOPool
        vm.startPrank(owner);
        address(idoPool).safeTransferETH(_poolDetails.liquidityWETH9);
        mockERC20.transfer(
            address(idoPool),
            _poolDetails.liquidityToken + tokenAmountInHardCap
        );
        vm.stopPrank();

        // Transfer Assertion
        uint256 tokenBalance = mockERC20.balanceOf(address(idoPool));
        uint256 ethBalance = address(idoPool).balance;
        assert(ethBalance == _poolDetails.liquidityWETH9);
        assert(
            tokenBalance == tokenAmountInHardCap + _poolDetails.liquidityToken
        );

        // Skip time to invest
        vm.warp(_poolTime.startTime);

        bytes32[] memory proof;
        uint256 investAmount = idoPool.getPoolSoftCap();
        // Invest just reached soft cap 
        uint256 timeToInvest = idoPool.getPoolSoftCap() / idoPool.getPoolMaxInvest();
        for (uint256 i = 0; i < timeToInvest + 1; i++) {
            // investAmount = bound(investAmount, idoPool.getPoolSoftCap(), idoPool.getPoolHardCap());
            if (idoPool.getPoolRaisedAmount() + investAmount > idoPool.getPoolHardCap()) {
                continue;
            }
            address sender = makeAddr(string(abi.encode("sender", i)));
            vm.deal(sender, investAmount);
            vm.prank(sender);
            idoPool.investPool{value: idoPool.getPoolMaxInvest()}(proof);
        }

        // Skip time to end
        vm.warp(_poolTime.endTime);

        // List in Dex
        address liquidityTo = owner; // Liquidity Activity = NOTHING
        vm.startPrank(owner);
        idoPool.listInDex(liquidityTo);
        vm.stopPrank();

        assert(idoPool.getHasListedDex() == true);
        assert(address(idoPool).balance == idoPool.getPoolRaisedAmount());
        assert(mockERC20.balanceOf(address(idoPool)) == idoPool.getPoolRaisedAmount().mulWad(idoPool.getPricePerToken()));
    }

    function test_investPoolSuccessfully(
        uint256 _pricePerToken,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _minInvest,
        uint256 _maxInvest,
        uint256 _liquidityWETH9,
        uint256 _liquidityToken,
        uint256 _privateSaleAmount,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _startPublicSale,
        uint256 _investAmount
    ) public {
        uint256 liquidityWETH9 = bound(_liquidityWETH9, MIN_WETH, 100 ether);
        vm.deal(owner, liquidityWETH9);
        uint256 maxHardCap = 100 ether;
        uint256 softCap = bound(_softCap, MIN_PRICE_TOKEN, maxHardCap - 1);
        uint256 hardCap = bound(_hardCap, softCap + 1, maxHardCap);
        uint256 pricePerToken = bound(_pricePerToken, MIN_PRICE_TOKEN, 1 ether);
        uint256 tokenAmountInHardCap = hardCap.mulWad(pricePerToken);
        uint256 liquidityToken = bound(
            _liquidityToken,
            0,
            tokenAmountInHardCap * 2
        );
        uint256 minInvest = bound(_minInvest, MIN_PRICE_TOKEN, hardCap - 1);
        // assert((hardCap / minInvest) * minInvest >= softCap);
        vm.assume((hardCap / minInvest) * minInvest >= softCap);
        uint256 maxInvest = bound(_maxInvest, minInvest, hardCap - 1);
        bool _PRIVATE_SALE = false;
        bytes32 _WHITELISTED = EMPTY_ROOT;
        uint256 privateSaleAmount = 0;
        IIDOPool.IDOPoolDetails memory _poolDetails = IIDOPool.IDOPoolDetails({
            tokenAddress: address(mockERC20),
            raisedAmount: 0,
            raisedTokenAmount: 0,
            pricePerToken: pricePerToken,
            softCap: softCap,
            hardCap: hardCap,
            minInvest: minInvest,
            maxInvest: maxInvest,
            liquidityWETH9: liquidityWETH9,
            liquidityToken: liquidityToken,
            privateSaleAmount: privateSaleAmount
        });
        uint256 startTime = bound(
            _startTime,
            block.timestamp + MIN_DELAY_STARTING,
            block.timestamp + YEAR - 1
        );
        uint256 endTime = bound(
            _endTime,
            startTime + 1,
            block.timestamp + YEAR
        );
        uint256 startPublicSale = 0;

        IIDOPool.IDOTime memory _poolTime = IIDOPool.IDOTime({
            startTime: startTime,
            endTime: endTime,
            startPublicSale: startPublicSale
        });
        vm.startPrank(owner);
        idoPool = new IDOPool(
            address(aoiFactory),
            address(aoiRouter),
            address(WETH)
        );
        mockERC20.mint(
            owner,
            tokenAmountInHardCap + _poolDetails.liquidityToken
        );
        mockERC20.approve(address(idoPool), type(uint256).max);
        idoPool.initialize(
            _poolDetails,
            _poolTime,
            owner,
            _WHITELISTED,
            _PRIVATE_SALE
        );
        vm.stopPrank();

        // Assert
        assert(idoPool.getPoolTokenAddress() == address(mockERC20));
        assert(idoPool.getPricePerToken() == _poolDetails.pricePerToken);
        assert(idoPool.getPoolStartTime() == _poolTime.startTime);
        assert(idoPool.getPoolEndTime() == _poolTime.endTime);
        assert(idoPool.getPoolRaisedAmount() == 0);
        assert(idoPool.getPoolTokenAmount() == 0);
        assert(idoPool.getPoolSoftCap() == _poolDetails.softCap);
        assert(idoPool.getPoolHardCap() == _poolDetails.hardCap);
        assert(idoPool.getPoolMinInvest() == _poolDetails.minInvest);
        assert(idoPool.getPoolMaxInvest() == _poolDetails.maxInvest);
        assert(
            idoPool.getLiquidityWETH9Amount() == _poolDetails.liquidityWETH9
        );
        assert(
            idoPool.getLiquidityTokenAmount() == _poolDetails.liquidityToken
        );
        assert(idoPool.getPoolOwner() == owner);

        // Transfer ETH & IDOToken to IDOPool
        vm.startPrank(owner);
        address(idoPool).safeTransferETH(_poolDetails.liquidityWETH9);
        mockERC20.transfer(
            address(idoPool),
            _poolDetails.liquidityToken + tokenAmountInHardCap
        );
        vm.stopPrank();

        // Transfer Assertion
        uint256 tokenBalance = mockERC20.balanceOf(address(idoPool));
        uint256 ethBalance = address(idoPool).balance;
        assert(ethBalance == _poolDetails.liquidityWETH9);
        assert(
            tokenBalance == tokenAmountInHardCap + _poolDetails.liquidityToken
        );

        // Skip time to invest
        vm.warp(startTime);

        // Default proof as public pool
        bytes32[] memory proof;
        address testAddr = makeAddr("test address");
        vm.deal(testAddr, minInvest);
        vm.prank(testAddr);
        idoPool.investPool{value: minInvest}(proof);
    }

    // function test_investPoolFailedWithReachedHardCap() public {}

    // function test_investPoolFailedWithErrorTimeFrame() public {}

    // function test_investPoolFailedWithExceededMaxInvest() public {}

    // function test_investPoolFailedWithUnderMinInvest() public {}

    // function test_cancelInvestmentSuccessfully() public {}

    // function test_cancelInvestmentFailedWithNoInvestment() public {}
}
