//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIDOFactoryState {
    // ERRORS
    error InvalidPoolId();

    error NotPoolOwner();

    error ActionIsNotNothing();

    error InvalidAction();

    error LiquidityIsNotLocked();

    error CannotUnlockLiquidityLocked();

    error IdoPoolAlreadyDeposited();

    error InvalidTokenAddress();

    error InvalidPricePerToken();

    error InvalidLockExpired();

    // EVENTS

    event PoolCreated(
        address indexed owner,
        address indexed tokenAddress,
        uint256 poolId
    );
}