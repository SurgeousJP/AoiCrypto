//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIDOFactory {
    enum LiquidityPoolAction {
        NOTHING,
        LOCK,
        BURN
    }
    
    struct LiquidityPool {
        uint256 idoPoolId;
        address idoPoolAddress;
        address liquidityPoolAddress;
        LiquidityPoolAction action;
        uint256 lockDuration;
    }

    function createPool(
        address tokenAddress,
        uint256 pricePerToken,
        uint256 startTime,
        uint256 endTime,
        uint256 minInvest,
        uint256 maxInvest,
        uint256 softCap,
        uint256 hardCap,
        bool isPrivateSales,
        uint256 liquidityWETH9,
        uint256 liquidityToken
    ) external payable returns (uint256, address);

    function depositLiquidityPool(
        uint256 poolId
    ) external returns (address);

    function getLiquidityPoolAddress(uint256 poolId) external view returns(address);

    function getIdoPoolAddress(uint256 poolId) external view returns (address);

    function getTotalPool() external view returns (uint256);

    function checkPoolIsValid(uint256 poolId) external view returns (bool);

    error InValidPoolId();
    
    error NotPoolOwner();

    event PoolCreated(
        address indexed owner,
        address indexed tokenAddress,
        uint256 poolId,
        uint256 startTime,
        uint256 endTime
    );

    event PoolDepositedLiquidityPool(
        address indexed liquidityPool,
        uint256 indexed poolId,
        address tokenAddress,
        uint256 amountToken1,
        uint256 amountToken2
    )
}
