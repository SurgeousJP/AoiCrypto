import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PoolCreated } from "../../generated/IDOFactory/IDOFactory";
import { IDOPool, LiquidityPool } from "../../generated/schema";
import { IDOPool as IDOPoolTemplate } from "../../generated/templates";
import {
  getIDOPoolAddress,
  getIDOPoolDetail,
  getIDOPoolId,
  getIDOTime,
  getIDOType,
  getWhitelistedRoot,
} from "../module/ido";
import {
  buildLiquidityPoolFromIDOPool,
  getLiquidityPool,
  getLiquidityPoolAction,
} from "../module/liquidityPool";
import * as utils from "../module/util/index";
import { buildCountFromIdoPool } from "../module/count";
import { createOrLoadPoolOwner } from "../module/poolOwner";

export function handlePoolCreated(event: PoolCreated): void {
  const poolId = event.params.poolId;
  const owner = event.params.owner;
  const tokenAddress = event.params.tokenAddress;
  const idoPoolAddress = getIDOPoolAddress(poolId);
  const idoPoolId = getIDOPoolId(idoPoolAddress); // id for both IDOPool and LiquidityPool

  // Create the IDOPool instances
  IDOPoolTemplate.create(idoPoolAddress);

  const idoPoolDetail = getIDOPoolDetail(idoPoolAddress);
  if (idoPoolDetail.tokenAddress.equals(Address.zero())) {
    return;
  }
  const liquidityPoolDetail = getLiquidityPool(poolId);
  if (liquidityPoolDetail.idoPoolAddress.equals(Address.zero())) {
    return;
  }
  const idoTimeDetail = getIDOTime(idoPoolAddress);
  if (idoTimeDetail.startTime.equals(BigInt.fromI32(0))) {
    return;
  }
  let idoPool = new IDOPool(idoPoolId);
  idoPool.poolId = poolId;
  idoPool.poolOwner = owner;
  idoPool.poolAddress = idoPoolAddress;
  idoPool.tokenPool = tokenAddress;
  idoPool.pricePerToken = idoPoolDetail.pricePerToken;
  idoPool.raisedAmount = idoPoolDetail.raisedAmount;
  idoPool.raisedTokenAmount = idoPoolDetail.raisedTokenAmount;
  idoPool.softCap = idoPoolDetail.softCap;
  idoPool.hardCap = idoPoolDetail.hardCap;
  idoPool.minInvest = idoPoolDetail.minInvest;
  idoPool.maxInvest = idoPoolDetail.maxInvest;
  idoPool.liquidityTokenAmount = idoPoolDetail.liquidityToken;
  idoPool.liquidityWETHAmount = idoPoolDetail.liquidityWETH9;
  idoPool.whitelistedRoot = getWhitelistedRoot(idoPoolAddress);
  idoPool.idoType = getIDOType(idoPoolAddress);
  idoPool.createdTime = event.block.timestamp;
  idoPool.startTime = idoTimeDetail.startTime;
  idoPool.endTime = idoTimeDetail.endTime;
  idoPool.startPublicSale = idoTimeDetail.startPublicSale;
  let liquidityPool = buildLiquidityPoolFromIDOPool(idoPool);
  liquidityPool.token0 = tokenAddress;
  liquidityPool.token1 = utils.addresses.wethAddress;
  liquidityPool.token0Amount = idoPoolDetail.liquidityToken;
  liquidityPool.token1Amount = idoPoolDetail.liquidityWETH9;
  liquidityPool.action = getLiquidityPoolAction(poolId);
  liquidityPool.lpToAddress = liquidityPoolDetail.to;
  liquidityPool.lockExpired = liquidityPoolDetail.lockExpired;
  liquidityPool.save();

  let metric = buildCountFromIdoPool(idoPool);
  metric.save();

  createOrLoadPoolOwner(owner, idoPoolAddress);
  idoPool.save();

  log.info("Creating IDO Pool: {}", [
    idoPool.id.toHexString(),
    idoPool.poolId.toHexString(),
    idoPool.poolOwner.toHexString(),
    idoPool.tokenPool.toHexString(),
    idoPool.idoType,
  ]);
}
