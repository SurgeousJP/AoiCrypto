//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IDOFactoryState} from "./IDOFactoryState.sol";
import {IIDOFactory} from "../interfaces/IIDOFactory.sol";
import {IDOPool} from "../IDO/IDOPool.sol";
import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {IAoiERC20} from "../interfaces/DEX/IAoiERC20.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";

contract IDOFactory is IDOFactoryState, IIDOFactory, Ownable {
    using SafeERC20 for IERC20;
    using SafeTransferLib for address;
    using FixedPointMathLib for uint256;

    mapping(uint256 => address) internal idoPoolAddresses;

    mapping(uint256 => LiquidityPool) internal liquidityPoolsByPoolId;

    constructor(
        address _aoiFactory,
        address _aoiRouter,
        address _WETH
    ) Ownable(_msgSender()) IDOFactoryState(_aoiFactory, _aoiRouter, _WETH) {}

    function createPool(
        IIDOPool.IDOPoolDetails memory poolDetails,
        IIDOPool.IDOTime memory poolTime,
        bool privateSale,
        bytes32 whitelisted, // could be default value
        LiquidityPoolAction action,
        uint256 lockExpired
    ) external payable override returns (address poolAddress) {
        address poolOwner = _msgSender();
        poolDetails.raisedAmount = 0;
        poolDetails.raisedTokenAmount = 0;
        // Deploy with assembly to save gas
        bytes memory bytecode = abi.encodePacked(
            type(IDOPool).creationCode,
            abi.encode(WETH),
            abi.encode(AOI_DEX_FACTORY),
            abi.encode(AOI_DEX_ROUTER)
        );
        bytes32 salt = keccak256(abi.encodePacked(poolOwner, block.timestamp));
        assembly {
            poolAddress := create2(
                0,
                add(bytecode, 0x20),
                mload(bytecode),
                salt
            )
            if iszero(extcodesize(poolAddress)) {
                revert(0, 0)
            }
        }
        // Initialized IDO pool
        IIDOPool(poolAddress).initialize(
            poolDetails,
            poolTime,
            poolOwner,
            whitelisted,
            privateSale
        );
        uint256 poolId = totalPool;
        if (
            action == LiquidityPoolAction.LOCK &&
            lockExpired < MIN_LOCKED_DURATION + poolTime.endTime
        ) {
            revert InvalidLockExpired();
        }
        LiquidityPool memory liquidityPool = LiquidityPool({
            idoPoolId: poolId,
            idoOwner: poolOwner,
            idoPoolAddress: poolAddress,
            tokenAddress: poolDetails.tokenAddress,
            tokenAmount: poolDetails.liquidityToken,
            wethAmount: poolDetails.liquidityWETH9,
            lpAmount: 0,
            liquidityPoolAddress: address(0),
            action: action,
            to: action == LiquidityPoolAction.LOCK
                ? address(this)
                : action == LiquidityPoolAction.BURN
                    ? address(0)
                    : poolOwner,
            lockExpired: action == LiquidityPoolAction.LOCK ? lockExpired : 0
        });
        // Save states
        liquidityPoolsByPoolId[poolId] = liquidityPool;
        idoPoolAddresses[poolId] = poolAddress;
        totalPool++;

        // Transfer ether to IDO pool for liquidity
        require(msg.value == poolDetails.liquidityWETH9);
        poolAddress.safeTransferETH(poolDetails.liquidityWETH9);

        uint256 tokenAmountInHardCap = poolDetails.hardCap.mulWad(
            poolDetails.pricePerToken
        );
        address tokenAddress = poolDetails.tokenAddress;
        uint256 liquidityToken = poolDetails.liquidityToken;
        // Transfer token to ido pool
        IERC20(tokenAddress).safeTransferFrom(
            poolOwner,
            poolAddress,
            tokenAmountInHardCap + liquidityToken
        );
        // Emit Event
        emit PoolCreated(poolOwner, poolDetails.tokenAddress, poolId);
    }

    // Deposited Liquidity Amount to list in DEX
    function depositLiquidityPool(
        uint256 poolId
    ) external returns (address liquidityPoolAddress, uint256 lpAmount) {
        address idoPool = idoPoolAddresses[poolId];
        if (idoPool == address(0)) {
            revert InvalidPoolId();
        }

        LiquidityPool memory liquidityPool = liquidityPoolsByPoolId[poolId];
        if (liquidityPool.liquidityPoolAddress != address(0)) {
            revert IdoPoolAlreadyDeposited();
        }

        // Listing liquidity from IDO pool to DEX
        (liquidityPoolAddress, lpAmount) = IIDOPool(idoPool).listInDex(
            liquidityPool.to
        );

        liquidityPoolsByPoolId[poolId]
            .liquidityPoolAddress = liquidityPoolAddress;
        liquidityPoolsByPoolId[poolId].lpAmount = lpAmount;
    }

    function receiveLpToken(uint256 poolId) external override {
        LiquidityPool memory liquidityPool = liquidityPoolsByPoolId[poolId];
        address poolOwner = _msgSender();
        if (poolOwner != liquidityPool.idoOwner) {
            revert NotPoolOwner();
        }
        if (
            liquidityPool.action != LiquidityPoolAction.LOCK ||
            liquidityPool.lockExpired == 0
        ) {
            revert LiquidityIsNotLocked();
        }
        if (liquidityPool.lockExpired > block.timestamp) {
            revert CannotUnlockLiquidityLocked();
        }
        // Save state
        liquidityPoolsByPoolId[poolId].lockExpired = 0;
        // Send lp token
        IAoiERC20(liquidityPool.liquidityPoolAddress).transfer(
            poolOwner,
            liquidityPool.lpAmount
        );
    }

    function setDexFactory(address _aoiFactory) external onlyOwner {
        AOI_DEX_FACTORY = _aoiFactory;
    }

    function setDexRouter(address _aoiRouter) external onlyOwner {
        AOI_DEX_ROUTER = _aoiRouter;
    }

    function setWETH(address _WETH) external onlyOwner {
        WETH = _WETH;
    }

    // VIEW FUNTIONS

    function getIdoPoolAddress(uint256 poolId) external view returns (address) {
        return idoPoolAddresses[poolId];
    }

    function getLiquidityPool(uint256 poolId) external view returns(LiquidityPool memory) {
        return liquidityPoolsByPoolId[poolId];
    }

    function getLiquidityPoolAddress(
        uint256 poolId
    ) external view returns (address) {
        return liquidityPoolsByPoolId[poolId].liquidityPoolAddress;
    }

    function getLpAmount(
        uint256 poolId
    ) external view override returns (uint256) {
        return liquidityPoolsByPoolId[poolId].lpAmount;
    }

    function getLiquidityLockExpired(
        uint256 poolId
    ) external view returns (uint256) {
        return liquidityPoolsByPoolId[poolId].lockExpired;
    }

    function getLiquidityPoolAction(
        uint256 poolId
    ) external view returns (LiquidityPoolAction) {
        return liquidityPoolsByPoolId[poolId].action;
    }

    function getTotalPool() external view returns (uint256) {
        return totalPool - 1;
    }

    function checkPoolIsValid(uint256 poolId) external view returns (bool) {
        return idoPoolAddresses[poolId] != address(0);
    }

    receive() external payable {}
}
