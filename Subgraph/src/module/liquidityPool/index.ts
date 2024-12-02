import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { IDOPool, LiquidityPool } from "../../../generated/schema";
import * as utils from "../util/index";
import * as liquidityPoolTypes from "./type";

export function getLiquidityPool(
  poolId: BigInt
): liquidityPoolTypes.LiquidityPoolDetail {
  const liquidityPoolDetailCallResult = utils.contracts.idoFactoryContract.try_getLiquidityPool(
    poolId
  );
  let liquidityPoolDetail: liquidityPoolTypes.LiquidityPoolDetail =
    liquidityPoolTypes.LiquidityPoolDetailDefault;
  if (liquidityPoolDetailCallResult.reverted) {
    log.warning("getLiquidityPool call reverted for poolId: {}", [
      poolId.toHexString(),
    ]);
  } else {
    const value = liquidityPoolDetailCallResult.value;
    liquidityPoolDetail = {
      idoPoolId: value.idoPoolId,
      idoOwner: value.idoOwner,
      idoPoolAddress: value.idoPoolAddress,
      tokenAddress: value.tokenAddress,
      tokenAmount: value.tokenAmount,
      wethAmount: value.wethAmount,
      lpAmount: value.lpAmount,
      liquidityPoolAddress: value.liquidityPoolAddress,
      action: value.action,
      to: value.to,
      lockExpired: value.lockExpired,
    };
  }

  return liquidityPoolDetail;
}

export function getLiquidityPoolAction(poolId: BigInt): string {
  const liquidityPoolAction = utils.contracts.idoFactoryContract.try_getLiquidityPoolAction(
    poolId
  );
  let action = "Unknown";
  if (liquidityPoolAction.reverted) {
    log.warning("getLiquidityPool call reverted for poolId: {}", [
      poolId.toHexString(),
    ]);
  } else if (
    liquidityPoolAction.value ==
    liquidityPoolTypes.LiquidityPoolActionEnum.NOTHING
  ) {
    action = liquidityPoolTypes.NOTHING;
  } else if (
    liquidityPoolAction.value == liquidityPoolTypes.LiquidityPoolActionEnum.LOCK
  ) {
    action = liquidityPoolTypes.LOCK;
  } else if (
    liquidityPoolAction.value == liquidityPoolTypes.LiquidityPoolActionEnum.BURN
  ) {
    action = liquidityPoolTypes.BURN;
  }

  return action;
}

export function buildLiquidityPoolFromIDOPool(idoPool: IDOPool): LiquidityPool {
  let liquidityPool = LiquidityPool.load(idoPool.id);
  if (liquidityPool == null) {
    const liquidityPoolDetail = getLiquidityPool(idoPool.poolId);
    liquidityPool = new LiquidityPool(idoPool.id);
    liquidityPool.idoPool = idoPool.id;
    liquidityPool.token0 = liquidityPoolDetail.tokenAddress;
    liquidityPool.token1 = utils.addresses.wethAddress;
    liquidityPool.token0Amount = liquidityPoolDetail.tokenAmount;
    liquidityPool.token1Amount = liquidityPoolDetail.wethAmount;
    liquidityPool.liquidityPoolAddress = Address.zero();
    liquidityPool.action =
      liquidityPoolDetail.action ==
      liquidityPoolTypes.LiquidityPoolActionEnum.BURN
        ? liquidityPoolTypes.BURN
        : liquidityPoolDetail.action ==
          liquidityPoolTypes.LiquidityPoolActionEnum.LOCK
        ? liquidityPoolTypes.LOCK
        : liquidityPoolTypes.NOTHING;
    liquidityPool.lpToAddress = liquidityPoolDetail.to;
    liquidityPool.lockExpired = liquidityPoolDetail.lockExpired;
    liquidityPool.createdTime = BigInt.zero();
  }

  return liquidityPool;
}
