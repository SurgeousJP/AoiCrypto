//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20Factory {
    function createNewERC20(
        address owner,
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint256 initialSupply
    ) external returns(address);
}