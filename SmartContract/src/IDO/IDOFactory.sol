//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IIDOFactory} from "../interfaces/IIDOFactory.sol";
import {IDOPool} from "../IDO/IDOPool.sol";
import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {IUniswapV3Factory} from "../interfaces/IUniswapV3Factory.sol";

contract IDOFactory is IIDOFactory, Ownable {
    using SafeERC20 for IERC20;

    mapping(uint256 => address) public idoPools;

    mapping(uint256 => LiquidityPool) public liquidityPoolsByPoolId;

    uint256 internal totalPool = 1;

    address public immutable UNISWAP_V3_FACTORY;

    uint256 public constant MIN_WETH = 1 ether;

    constructor(address _uniswapFactory) Ownable(_msgSender()) {
        UNISWAP_V3_FACTORY = _uniswapFactory;
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
    ) external payable returns (address poolAddress) {
        require(liquidityWETH9 >= MIN_WETH);
        address poolOwner = _msgSender();
        uint256 newPoolId = totalPool;
        IDOPool memory idoPool = new IDOPool(
            poolOwner,
            tokenAddress,
            pricePerToken,
            startTime,
            endTime,
            minInvest,
            maxInvest,
            hardCap,
            softCap,
            isPrivateSales,
            liquidityWETH9,
            liquidityToken,
            UNISWAP_V3_FACTORY
        );
        poolAddress = address(idoPool);
        pools[newPoolId] = poolAddress;
        poolIsCreated[poolAddress] = true;
        totalPool++;

        uint256 liquidityWETH9InSoftCap = pricePerToken * softCap;
        uint256 amountWETH9PayFirst = liquidityWETH9InSoftCap < liquidityWETH9
            ? liquidityWETH9 - liquidityWETH9InSoftCap
            : 0;
        uint256 amountTokenPayFirst = hardCap + liquidityToken;

        // Transfer token to pool
        if (amountWETH9PayFirst != 0) {
            require(msg.value == amountWETH9PayFirst);
            poolAddress.transfer(amountWETH9PayFirst);
        }
        IERC20(tokenAddress).safeTransferFrom(
            poolOwner,
            poolAddress,
            amountTokenPayFirst
        );

        emit PoolCreated(owner, tokenAddress, newPoolId, startTime, endTime);
    }

    function depositLiquidityPool(
        uint256 poolId,
        LiquidityPoolAction action
    ) external returns (address liquidityPool) {
        address idoPool = pools[poolId];
        if (idoPool == address(0)) {
            revert InValidPoolId();
        }

        address idoOwner = IIDOPool(idoPool).getPoolOwner();
        address tokenAddress = IIDOPool(idoPool).getPoolTokenAddress();
        uint256 amount0 = IIDOPool(idoPool).getLiquidityWETH9();
        uint256 amount1 = IIDOPool(idoPool).getLiquidityToken();
        if (idoOwner != _msgSender()) {
            revert NotPoolOwner();
        }

        liquidityPool = IDOPool(idoPool).listInDex();
        liquidityPoolByPoolId[poolId] = liquidityPool;

        emit PoolDepositedLiquidityPool(
            liquidityPool,
            poolId,
            tokenAddress,
            amount0,
            amount1
        );
    }

    // VIEW FUNTIONS

    function getLiquidityPoolAddress(
        uint256 poolId
    ) external view returns (address) {
        return liquidityPoolByPoolId[poolId];
    }

    function getIdoPoolAddress(uint256 poolId) external view returns (address) {
        return pools[poolId];
    }

    function getTotalPool() external view returns (uint256) {
        return totalPool - 1;
    }

    function checkPoolIsValid(uint256 poolId) external view returns (bool) {
        return poolIsCreated[pools[poolId]];
    }
}
