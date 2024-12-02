import { Address, BigInt } from "@graphprotocol/graph-ts";

export const NOTHING = "Nothing";
export const LOCK = "Lock";
export const BURN = "Burn";

export class LiquidityPoolDetail {
  idoPoolId: BigInt;
  idoOwner: Address;
  idoPoolAddress: Address;
  tokenAddress: Address;
  tokenAmount: BigInt;
  wethAmount: BigInt;
  lpAmount: BigInt;
  liquidityPoolAddress: Address;
  action: LiquidityPoolActionEnum;
  to: Address;
  lockExpired: BigInt;
}

export enum LiquidityPoolActionEnum {
  NOTHING,
  LOCK,
  BURN,
}

export const LiquidityPoolDetailDefault: LiquidityPoolDetail = {
  idoPoolId: BigInt.fromI32(0),
  idoOwner: Address.zero(),
  idoPoolAddress: Address.zero(),
  tokenAddress: Address.zero(),
  tokenAmount: BigInt.fromI32(0),
  wethAmount: BigInt.fromI32(0),
  lpAmount: BigInt.fromI32(0),
  liquidityPoolAddress: Address.zero(),
  action: LiquidityPoolActionEnum.NOTHING,
  to: Address.zero(),
  lockExpired: BigInt.fromI32(0),
};
