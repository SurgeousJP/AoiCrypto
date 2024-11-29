import { Address, BigInt } from "@graphprotocol/graph-ts";

export const PRIVATE_SALE = "Private Sale";
export const PUBLIC_SALE = "Public Sale";

export enum IDOTypeEnum {
  PUBLIC_SALE,
  PRIVATE_SALE,
}

export interface IDOPoolDetail {
  tokenAddress: Address;
  pricePerToken: BigInt;
  raisedAmount: BigInt;
  raisedTokenAmount: BigInt;
  softCap: BigInt;
  hardCap: BigInt;
  minInvest: BigInt;
  maxInvest: BigInt;
  liquidityWETH9: BigInt;
  liquidityToken: BigInt;
  privateSaleAmount: BigInt;
}

export interface IDOPoolTime {
  startTime: BigInt;
  endTime: BigInt;
  startPublicSale: BigInt;
}

export const IDOPoolDetailDefault: IDOPoolDetail = {
  tokenAddress: Address.zero(),
  softCap: BigInt.fromI32(0),
  hardCap: BigInt.fromI32(0),
  liquidityToken: BigInt.fromI32(0),
  liquidityWETH9: BigInt.fromI32(0),
  maxInvest: BigInt.fromI32(0),
  minInvest: BigInt.fromI32(0),
  pricePerToken: BigInt.fromI32(0),
  privateSaleAmount: BigInt.fromI32(0),
  raisedAmount: BigInt.fromI32(0),
  raisedTokenAmount: BigInt.fromI32(0),
};

export const IDOTimeDefault: IDOPoolTime = {
  startTime: BigInt.fromI32(0),
  endTime: BigInt.fromI32(0),
  startPublicSale: BigInt.fromI32(0),
};
