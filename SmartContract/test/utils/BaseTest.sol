//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console, console2} from "lib/forge-std/src/Test.sol";
import {IDOFactory} from "../../src/IDO/IDOFactory.sol";
import {MOCK_WETH9} from "../mock/MockWETH.sol";
import {AoiFactory} from "../../src/DEX/AoiFactory.sol";
import {AoiRouter} from "../../src/DEX/AoiRouter.sol";

abstract contract BaseTest is Test {
    bytes32 public constant EMPTY_ROOT = bytes32(0);
    uint112 public constant MIN_DELAY_STARTING = uint112(10 * 60); // 10 minutes
    uint112 public constant MIN_PRIVATE_SALES_ENDING = uint112(5 * 60); // 5 minutes
    uint256 public constant MINIMUM_LIQUIDITY = 10 ** 3;
    uint256 public constant MIN_PRICE_TOKEN = 10 ** 15; // MIN: 1 token = 0.001 WETH
    uint256 public constant MIN_WETH = 1 ether;

    uint256 public constant HOUR = 60 * 60;
    uint256 public constant DAY = 24 * HOUR;
    uint256 public constant WEEK = 7 * DAY;
    uint256 public constant MONTH = 30 * DAY;
    uint256 public constant YEAR = 365 * DAY;

    IDOFactory internal idoFactory;
    AoiFactory internal aoiFactory;
    AoiRouter internal aoiRouter;
    MOCK_WETH9 internal WETH;

    address public owner;
    address public addr1;
    address public addr2;

    function setUp() public virtual {
        addr1 = makeAddr("User1");
        vm.deal(addr1, 100 ether);
        addr2 = makeAddr("User2");
        vm.deal(addr2, 100 ether);
        WETH = new MOCK_WETH9();
        owner = makeAddr("OWNER");
        vm.deal(owner, 100 ether);
        vm.startPrank(owner);
        aoiFactory = new AoiFactory(owner);
        aoiRouter = new AoiRouter(address(aoiFactory), address(WETH));
        idoFactory = new IDOFactory(
            address(aoiFactory),
            address(aoiRouter),
            address(WETH)
        );
        aoiFactory.setFeeTo(owner);
        vm.stopPrank();
    }
}
