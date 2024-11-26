//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "@forge-std/Script.sol";

import {WETH} from "../src/DEX/WETH.sol";
import {AoiFactory} from "../src/DEX/AoiFactory.sol";
import {AoiRouter} from "../src/DEX/AoiRouter.sol";
import {IDOFactory} from "../src/IDO/IDOFactory.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.envAddress("DEPLOYER");
        vm.startBroadcast(deployerPrivateKey);
        WETH weth = new WETH();
        AoiFactory factory = new AoiFactory(deployerAddress);
        factory.setFeeTo(deployerAddress);
        AoiRouter router = new AoiRouter(address(factory), address(weth));
        IDOFactory idoFactory = new IDOFactory(address(factory), address(router), address(weth));
        vm.stopBroadcast();
    }
}