//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "@forge-std/Script.sol";

import {WETH} from "../src/DEX/WETH.sol";
import {AoiFactory} from "../src/DEX/AoiFactory.sol";
import {AoiRouter} from "../src/DEX/AoiRouter.sol";
import {IDOFactory} from "../src/IDO/IDOFactory.sol";

contract CustomScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address factory = vm.envAddress("AOI_FACTORY");
        address router = vm.envAddress("AOI_ROUTER");
        address weth = vm.envAddress("WETH");
        vm.startBroadcast(deployerPrivateKey);
        IDOFactory idoFactory = new IDOFactory(factory, router, weth);
        vm.stopBroadcast();
    }
}