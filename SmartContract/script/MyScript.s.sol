//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "@forge-std/Script.sol";

import {WETH} from "../src/DEX/WETH.sol";
import {AoiFactory} from "../src/DEX/AoiFactory.sol";
import {AoiRouter} from "../src/DEX/AoiRouter.sol";
import {IDOFactory} from "../src/IDO/IDOFactory.sol";
// import {ERC20Factory} from "../src/Token/ERC20Factory.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.envAddress("DEPLOYER");
        address weth = vm.envAddress("WETH");
        vm.startBroadcast(deployerPrivateKey);
        // WETH weth = new WETH();
        AoiFactory factory = new AoiFactory(deployerAddress);
        factory.setFeeTo(deployerAddress);
        AoiRouter router = new AoiRouter(address(factory), weth);
        IDOFactory idoFactory = new IDOFactory(address(factory), address(router), weth);
        // ERC20Factory erc20Factory = new ERC20Factory();
        vm.stopBroadcast();
    }
}