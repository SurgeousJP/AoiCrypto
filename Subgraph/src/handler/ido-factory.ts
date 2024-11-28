import { Address, Bytes } from "@graphprotocol/graph-ts";
import { PoolCreated as PoolCreatedEvent } from "../../generated/AoiFactory/AoiFactory";
import { IDOPool, LiquidityPool } from "../../generated/schema";
import { IDOPool as IDOPoolTemplate } from "../../generated/templates";
import {
  getIDOPoolAddress,
  getIDOPoolDetail,
  getIDOPoolId,
  getIDOType,
  getWhitelistedRoot,
} from "../module/ido";
import {
  getLiquidityPool,
  getLiquidityPoolAction,
} from "../module/liquidityPool";
import * as utils from "../module/util/index";

export function handlePoolCreated(event: PoolCreatedEvent): void {
  const { poolId, owner, tokenAddress } = event.params;
  const idoPoolAddress = getIDOPoolAddress(poolId);
  const idoPoolId = getIDOPoolId(idoPoolAddress, poolId); // id for both IDOPool and LiquidityPool

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

  let liquidityPool = new LiquidityPool(idoPoolId);
  liquidityPool.idoPool = idoPoolId;
  liquidityPool.token0 = tokenAddress;
  liquidityPool.token1 = utils.addresses.wethAddress;
  liquidityPool.token0Amount = idoPoolDetail.liquidityToken;
  liquidityPool.token1Amount = idoPoolDetail.liquidityWETH9;
  liquidityPool.action = getLiquidityPoolAction(poolId);
  liquidityPool.lpToAddress = liquidityPoolDetail.to;
  liquidityPool.lockExpired = liquidityPoolDetail.lockExpired;
  liquidityPool.createdTime = event.block.timestamp;

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

  // TODO: Implement the idoTime to apply in idoPool
  // let idoTime
  // idoPool.startTime = idoPoolDetail.sta;
}
