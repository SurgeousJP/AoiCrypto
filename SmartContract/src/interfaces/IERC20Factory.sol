//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20FactoryState} from "./IERC20FactoryState.sol";

interface IERC20Factory {
    function createNewERC20(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint256 initialSupply
    ) external returns(address);

    function getTokenDetail(uint256 tokenId) external view returns(IERC20FactoryState.Token memory);

    function getTokenOwner(uint256 tokenId) external view returns(address);

    function getTokenAddress(uint256 tokenId) external view returns(address);
}