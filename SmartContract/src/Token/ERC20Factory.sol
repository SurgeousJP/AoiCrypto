//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {ERC20FactoryState} from "./ERC20FactoryState.sol";
import {IERC20Factory} from "../interfaces/IERC20Factory.sol";
import {AoiERC20} from "./CustomAoiERC20.sol";

contract ERC20Factory is IERC20Factory, Ownable, ERC20FactoryState {

    constructor(bytes memory _initCodeHash) Ownable(msg.sender) ERC20FactoryState() {}

    function createNewERC20(
        address tokenOwner,
        string memory name,
        string memory symbol,
        uint256 maxTotalSupply,
        uint256 initialSupply
    ) external override returns(address tokenAddress) {
        bytes memory bytecode = abi.encodePacked(
            type(AoiERC20).creationCode,
            abi.encode(tokenOwner),
            abi.encode(name),
            abi.encode(symbol),
            abi.encode(maxTotalSupply),
            abi.encode(initialSupply)
        );
        uint256 currentTime = block.timestamp;
        bytes32 salt = keccak256(abi.encodePacked(tokenOwner, currentTime));
        assembly {
            tokenAddress := create2(
                0,
                add(bytecode, 0x20),
                mload(bytecode),
                salt
            )
            if iszero(extcodesize(tokenAddress)) {
                revert(0, 0)
            }
        }

        Token memory token = Token({
            owner: tokenOwner,
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
}