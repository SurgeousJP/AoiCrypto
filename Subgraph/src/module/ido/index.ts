import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import * as idoTypes from "./type";
import * as utils from "../util/index";

export function getIDOPoolId(idoPoolAddress: Address): Bytes {
  return Bytes.fromHexString(idoPoolAddress.toHexString());
}

export function getIDOPoolAddress(poolId: BigInt): Address {
  const idoPoolAddressCallResult = utils.contracts.idoFactoryContract.try_getIdoPoolAddress(
    poolId
  );
  let idoPoolAddress: Address = Address.zero();
  if (idoPoolAddressCallResult.reverted) {
    log.warning("getIdoPoolAddress call reverted for poolId: {}", [
      poolId.toString(),
    ]);
  } else {
    log.info("getIdoPoolAddress result {} for poolId: {}", [
      idoPoolAddressCallResult.value.toHexString(),
      poolId.toString(),
    ]);
    idoPoolAddress = idoPoolAddressCallResult.value;
  }
  return idoPoolAddress;
}

export function getIDOPoolDetail(
  idoPoolAddress: Address
): idoTypes.IDOPoolDetail {
  const idoPoolContract = utils.contracts.getIDOPoolContract(idoPoolAddress);
  const idoPoolDetailCallResult = idoPoolContract.try_getPoolDetails();

  let idoPoolDetail: idoTypes.IDOPoolDetail = idoTypes.IDOPoolDetailDefault;
  if (idoPoolDetailCallResult.reverted) {
    log.warning("getPoolDetails call reverted for idoPoolAddress: {}", [
      idoPoolAddress.toHexString(),
    ]);
  } else {
    const value = idoPoolDetailCallResult.value;
    idoPoolDetail = {
      tokenAddress: value.tokenAddress,
      softCap: value.softCap,
      hardCap: value.hardCap,
      liquidityToken: value.liquidityToken,
      liquidityWETH9: value.liquidityWETH9,
      maxInvest: value.maxInvest,
      minInvest: value.minInvest,
      pricePerToken: value.pricePerToken,
      privateSaleAmount: value.privateSaleAmount,
      raisedAmount: value.raisedAmount,
      raisedTokenAmount: value.raisedTokenAmount,
    };
  }

  return idoPoolDetail;
}

export function getWhitelistedRoot(idoPoolAddress: Address): Bytes {
  const idoPoolContract = utils.contracts.getIDOPoolContract(idoPoolAddress);
  const idoPoolDetailCallResult = idoPoolContract.try_WHITELISTED();
  let whitelisted = new Bytes(0);
  if (idoPoolDetailCallResult.reverted) {
    log.warning("WHITELISTED call reverted for idoPoolAddress: {}", [
      idoPoolAddress.toHexString(),
    ]);
  } else {
    whitelisted = idoPoolDetailCallResult.value;
  }

  return whitelisted;
}

export function getIDOType(idoPoolAddress: Address): string {
  const idoPoolContract = utils.contracts.getIDOPoolContract(idoPoolAddress);
  const idoPoolDetailCallResult = idoPoolContract.try_getPoolType();
  // let idoType = idoTypes.IDOTypeEnum.PUBLIC_SALE;
  // if (idoPoolDetailCallResult.reverted) {
  //   log.warning("getPoolType call reverted for idoPoolAddress: {}", [
  //     idoPoolAddress.toHexString(),
  //   ]);
  // } else {
  //   idoType = idoPoolDetailCallResult.value;
  // }
  let idoType = "Unknown";
  if (idoPoolDetailCallResult.reverted) {
    log.warning("getPoolType call reverted for idoPoolAddress: {}", [
      idoPoolAddress.toHexString(),
    ]);
  } else if (
    idoPoolDetailCallResult.value == idoTypes.IDOTypeEnum.PRIVATE_SALE
  ) {
    idoType = idoTypes.PRIVATE_SALE;
  } else if (
    idoPoolDetailCallResult.value == idoTypes.IDOTypeEnum.PUBLIC_SALE
  ) {
    idoType = idoTypes.PUBLIC_SALE;
  } else {
    log.warning("Contract IDO Pool address {} is not being monitored", [
      idoPoolAddress.toHexString(),
    ]);
  }

  log.info("IDOType call result: {}", [idoType.toString()]);

  return idoType;
}

export function getIDOTime(idoPoolAddress: Address): idoTypes.IDOPoolTime {
  const idoPoolContract = utils.contracts.getIDOPoolContract(idoPoolAddress);
  const idoPoolTimeCallResult = idoPoolContract.try_getPoolTime();
  let idoPoolTime: idoTypes.IDOPoolTime = idoTypes.IDOTimeDefault;
  if (idoPoolTimeCallResult.reverted) {
    log.warning("getPoolTime call reverted for idoPoolAddress: {}", [
      idoPoolAddress.toHexString(),
    ]);
  } else {
    const value = idoPoolTimeCallResult.value;
    idoPoolTime = {
      startTime: value.startTime,
      endTime: value.endTime,
      startPublicSale: value.startPublicSale,
    };
  }
  return idoPoolTime;
}
