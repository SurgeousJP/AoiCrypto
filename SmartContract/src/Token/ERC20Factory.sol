//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {ERC20FactoryState} from "./ERC20FactoryState.sol";
import {IERC20Factory} from "../interfaces/IERC20Factory.sol";
import {AoiERC20} from "./CustomAoiERC20.sol";

contract ERC20Factory is IERC20Factory, Ownable, ERC20FactoryState {

    constructor() Ownable(msg.sender) ERC20FactoryState() {}

    function createNewERC20(
        string memory name,
        string memory symbol,
        uint256 maxTotalSupply,
        uint256 initialSupply
    ) external override returns(address tokenAddress) {
        address tokenOwner = msg.sender;
        uint256 currentTime = block.timestamp;
        bytes32 salt = keccak256(abi.encodePacked(tokenOwner, currentTime));
        tokenAddress = address(new AoiERC20{salt: salt}(tokenOwner, name, symbol, maxTotalSupply, initialSupply));
        Token memory token = Token({
            owner: tokenOwner,
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            maxSupply: maxTotalSupply,
            initialSupply: initialSupply,
            createdTime: currentTime
        });
        uint256 tokenId = totalTokens;
        tokens[tokenId] = token;
        totalTokens++;

        emit TokenCreated(tokenId, tokenAddress, tokenOwner);
    }

    function getTokenDetail(uint256 tokenId) external view override returns(Token memory) {
        return tokens[tokenId];
    }

    function getTokenOwner(uint256 tokenId) external view override returns(address) {
        return tokens[tokenId].owner;
    }

    function getTokenAddress(uint256 tokenId) external view override returns(address) {
        return tokens[tokenId].tokenAddress;
    }
}