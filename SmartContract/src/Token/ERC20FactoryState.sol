//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20FactoryState} from "../interfaces/IERC20FactoryState.sol";

contract ERC20FactoryState is IERC20FactoryState{

    mapping(uint256 => Token) public tokens;

    uint256 public totalTokens;
    
    constructor() {}
}