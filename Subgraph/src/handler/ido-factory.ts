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
import { createOrLoadPoolOwner, getPoolOwnerId } from "../module/poolOwner";
import { createOrLoadAccount } from "../module/account";

export function handlePoolCreated(event: PoolCreated): void {
  const poolId = event.params.poolId;
  const owner = event.params.owner;
  log.info("Create IDOPool poolId {} owner {}", [
    poolId.toString(),
    owner.toHexString(),
  ]);
  const tokenAddress = event.params.tokenAddress;
  const idoPoolAddress = getIDOPoolAddress(poolId);
  const idoPoolId = getIDOPoolId(idoPoolAddress); // id for both IDOPool and LiquidityPool

  log.info("Create IDOPool instances for idoPoolAddress {} idoPoolId {}", [
    idoPoolAddress.toHexString(),
    idoPoolId.toString(),
  ]);
  // Create the IDOPool instances
  IDOPoolTemplate.create(idoPoolAddress);

  const idoPoolDetail = getIDOPoolDetail(idoPoolAddress);
  log.info("idoPoolDetail {}", [
    idoPoolDetail.tokenAddress.toHexString(),
    idoPoolDetail.softCap.toString(),
    idoPoolDetail.hardCap.toString(),
  ]);
  if (idoPoolDetail.tokenAddress.equals(Address.zero())) {
    return;
  }
  const liquidityPoolDetail = getLiquidityPool(poolId);
  log.info("liquidityPoolDetail {}", [
    liquidityPoolDetail.idoPoolAddress.toHexString(),
  ]);
  if (liquidityPoolDetail.idoPoolAddress.equals(Address.zero())) {
    return;
  }
  const idoTimeDetail = getIDOTime(idoPoolAddress);
  log.info("idoTimeDetail {}", [
    idoTimeDetail.startTime.toString(),
    idoTimeDetail.endTime.toString(),
    idoTimeDetail.startPublicSale.toString(),
  ]);
  if (idoTimeDetail.startTime.equals(BigInt.fromI32(0))) {
    return;
  }
  log.info("Create IODPool entity", []);
  let idoPool = new IDOPool(idoPoolId);
  idoPool.poolId = poolId;
  idoPool.poolAddress = idoPoolAddress;
  idoPool.tokenPool = tokenAddress;
  idoPool.pricePerToken = idoPoolDetail.pricePerToken;
  idoPool.raisedAmount = idoPoolDetail.raisedAmount;
  idoPool.raisedTokenAmount = idoPoolDetail.raisedTokenAmount;
  idoPool.privateSaleAmount = idoPoolDetail.privateSaleAmount;
  idoPool.softCap = idoPoolDetail.softCap;
  idoPool.hardCap = idoPoolDetail.hardCap;
  idoPool.minInvest = idoPoolDetail.minInvest;
  idoPool.maxInvest = idoPoolDetail.maxInvest;
  idoPool.liquidityTokenAmount = idoPoolDetail.liquidityToken;
  idoPool.liquidityWETHAmount = idoPoolDetail.liquidityWETH9;
  const whitelisted = getWhitelistedRoot(idoPoolAddress);
  idoPool.whitelistedRoot = whitelisted;
  const idoType = getIDOType(idoPoolAddress);
  idoPool.idoType = idoType;
  idoPool.createdTime = event.block.timestamp;
  idoPool.startTime = idoTimeDetail.startTime;
  idoPool.endTime = idoTimeDetail.endTime;
  idoPool.startPublicSale = idoTimeDetail.startPublicSale;
  let liquidityPool = buildLiquidityPoolFromIDOPool(idoPool);
  liquidityPool.token0 = tokenAddress;
  liquidityPool.token1 = utils.addresses.wethAddress;
  liquidityPool.token0Amount = idoPoolDetail.liquidityToken;
  liquidityPool.token1Amount = idoPoolDetail.liquidityWETH9;
  // const action = getLiquidityPoolAction(poolId);
  // liquidityPool.action = action;
  // liquidityPool.lpToAddress = liquidityPoolDetail.to;
  // liquidityPool.lockExpired = liquidityPoolDetail.lockExpired;
  liquidityPool.save();
  idoPool.liquidityPool = liquidityPool.id;

  let metric = buildCountFromIdoPool(idoPool);
  metric.save();

  let poolOwner = createOrLoadPoolOwner(owner, idoPoolAddress);
  poolOwner.save();
  idoPool.poolOwner = poolOwner.id;
  idoPool.listed = false;
  idoPool.withdrawn = false;
  idoPool.searchPoolOwner = changetype<Bytes>(owner);
  idoPool.save();

  log.info("Creating IDO Pool: {}", [
    idoPool.id.toHexString(),
    idoPool.poolId.toHexString(),
    idoPool.poolOwner.toHexString(),
    idoPool.tokenPool.toHexString(),
    idoPool.idoType,
  ]);
}
