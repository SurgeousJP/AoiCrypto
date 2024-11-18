//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IAoiFactory} from "../interfaces/DEX/IAoiFactory.sol";
import {IAoiPair} from "../interfaces/DEX/IAoiPair.sol";
import {AoiPair} from "./AoiPair.sol";

contract AoiFactory is IAoiFactory {
    address public override feeTo;
    address public override feeToSetter;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view override returns (uint) {
        return allPairs.length;
    }

    function createPair(
        address tokenA,
        address tokenB
    ) external override returns (address pair) {
        require(tokenA != tokenB, "AoiCrypto: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "AoiCrypto: ZERO_ADDRESS");
        require(
            getPair[token0][token1] == address(0),
            "AoiCrypto: PAIR_EXISTS"
        ); // single check is sufficient
        bytes memory bytecode = type(AoiPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1)); // salt
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IAoiPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, "AoiCrypto: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, "AoiCrypto: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
