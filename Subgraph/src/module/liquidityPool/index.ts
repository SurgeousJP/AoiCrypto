import { BigInt, log } from "@graphprotocol/graph-ts";
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
    liquidityPoolDetail = liquidityPoolDetailCallResult.value;
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
    liquidityPool = new LiquidityPool(idoPool.id);
    liquidityPool.idoPool = idoPool.id;
  }

  return liquidityPool;
}
