import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import * as idoTypes from "./type";
import * as utils from "../util/index";

export function getIDOPoolId(idoPoolAddress: Address, poolId: BigInt): Bytes {
  return changetype<Bytes>(idoPoolAddress + "-" + poolId.toHexString());
}

export function getIDOPoolAddress(poolId: BigInt): Bytes {
  const idoPoolAddressCallResult = utils.contracts.idoFactoryContract.try_getIdoPoolAddress(
    poolId
  );
  let idoPoolAddress: Bytes = new Bytes(0);
  if (idoPoolAddressCallResult.reverted) {
    log.warning("getIdoPoolAddress call reverted for poolId: {}", [
      poolId.toString(),
    ]);
  } else {
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
    idoPoolDetail = idoPoolDetailCallResult.value;
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
    idoPoolTime = idoPoolTimeCallResult.value;
  }
  return idoPoolTime;
}
