//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseTest} from "./utils/BaseTest.sol";
import {MockERC20} from "./mock/MockERC20.sol";
import {IDOPool} from "../src/IDO/IDOPool.sol";

contract IDOFactoryTest is BaseTest {
    address public user;
    IDOPool public idoPool;
    MockERC20 public mockERC20;

    function setUp() public override {
        super.setUp();
        user = makeAddr("first pool owner");
        vm.deal(user, 100 ether);
        mockERC20 = new MockERC20();
    }

    function test_createNewPoolSuccessful() public {
        vm.prank(user);
        uint256 pricePerToken = 0.001 ether;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + 1 weeks;
        uint256 minInvest = 0.05 ether;
        uint256 maxInvest = 0.1 ether;
        uint256 softCap = 5_000_000;
        uint256 hardCap = 10_000_000;
        bool isPrivateSales = false;
        uint256 liquidityWETH9 = 2 ether;
        uint256 liquidityTokenInSoftCap = pricePerToken * softCap;
        uint256 liquidityToken = liquidityTokenInSoftCap / 2;

        idoPool = idoFactory.createPool(
            address(mockERC20),
            pricePerToken,
            startTime,
            endTime,
            minInvest,
            maxInvest,
            softCap,
            hardCap,
            isPrivateSales,
            liquidityWETH9,
            liquidityToken
        );

        uint256 poolId = idoFactory.getTotalPool();

        // Assert
        assert(poolId == 1);
        assert(address(idoPool) == idoFactory.pools(poolId));
        assert(idoFactory.poolIsCreated(address(idoPool)) == true);
        assert(idoPool.getPoolRaisedAmount() == 0);
        assert(idoPool.getPoolSoftCap() == softCap);
        assert(idoPool.getPoolHardCap() == hardCap);
        assert(idoPool.getPoolMinInvest() == minInvest);
        assert(idoPool.getPoolMaxInvest() == maxInvest);
        assert(idoPool.getPoolOwner() == user);
    }
}
