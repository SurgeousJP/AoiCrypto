//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AoiERC20 is Ownable, ERC20 {

    error MaxTotalSupplyExceed(uint256 value);

    uint256 immutable public MAX_SUPPLY;

    constructor(
        address owner, 
        string memory name, 
        string memory symbol, 
        uint256 _MAX_SUPPLY, 
        uint256 _initialSupply
    ) Ownable(owner) ERC20(name, symbol) {
        MAX_SUPPLY = _MAX_SUPPLY;
        _mint(owner, _initialSupply);
    }

    function mint(address account, uint256 value) external onlyOwner {
        if (totalSupply() + value > MAX_SUPPLY) {
            revert MaxTotalSupplyExceed(value);
        }
        _mint(account, value);
    }
}
