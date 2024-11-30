//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20FactoryState {
    struct Token {
        address owner;
        string name;
        string symbol;
        uint256 maxSupply;
        uint256 initialSupply;
        uint256 createdTime;
    }

    event TokenCreated(uint256 indexed tokenId, address indexed token, address owner);
}