import {
  BIGINT_CONVERSION_FACTOR,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { EMPTY_MERKLE_ROOT } from "@/utils/merkleTree";
// <---! GUIDELINES !---> //

// SOLIDITY TYPES => TYPESCRIPT TYPES
// address => string
// uint256 => bigint
// datetime => unix => bigint
// bytes32 => string (hexadecimal representation)
// enums => enums (nothing changes)

// <---! GUIDELINES !---> //

// <---! CONSTRAINTS !---> //
// userWallet's token amount >= hardCap + liquidityToken
// userWallet's ETH >= liquidityWETH9 (should be around 0.001 for testing)
// <---! CONSTRAINTS !---> //

export type CreateIDOInput = {
  poolDetails: PoolDetails;
  poolTime: PoolTime;
  privateSale: boolean;
  whitelisted: string;
  action: LiquidityPoolAction;
  lockExpired: bigint;
};

export type PoolDetails = {
  tokenAddress: string;
  pricePerToken: bigint;
  raisedAmount: bigint;
  raisedTokenAmount: bigint;
  softCap: bigint;
  hardCap: bigint;
  minInvest: bigint;
  maxInvest: bigint;
  liquidityWETH9: bigint;
  liquidityToken: bigint;
  privateSaleAmount: bigint;
};

export type PoolTime = {
  startTime: bigint;
  endTime: bigint;
  startPublicSale: bigint;
};

export enum LiquidityPoolAction {
  NOTHING,
  LOCK,
  BURN,
}

const createEmptyPoolDetails = (): PoolDetails => ({
  tokenAddress: "",
  pricePerToken: 0n,
  raisedAmount: 0n,
  raisedTokenAmount: 0n,
  softCap: 0n,
  hardCap: 0n,
  minInvest: 0n,
  maxInvest: 0n,
  liquidityWETH9: 0n,
  liquidityToken: 0n,
  privateSaleAmount: 0n,
});

export const createEmptyPoolTime = (): PoolTime => ({
  startTime: BigInt(getUnixTimestampFromDate(new Date())),
  endTime: BigInt(getUnixTimestampFromDate(new Date())),
  startPublicSale: BigInt(getUnixTimestampFromDate(new Date())),
});

export const createDefaultCreateIDOInput = (): CreateIDOInput => ({
  poolDetails: createEmptyPoolDetails(),
  poolTime: createEmptyPoolTime(),
  privateSale: false,
  whitelisted: EMPTY_MERKLE_ROOT,
  action: LiquidityPoolAction.NOTHING,
  lockExpired: 0n,
});

export const sampleCreateIDOInput: CreateIDOInput = {
  poolDetails: {
    tokenAddress: "0x82a9d5f57483163de82ef5d40d045be974d9d215",
    pricePerToken: BigInt(0.0001 * BIGINT_CONVERSION_FACTOR),
    raisedAmount: BigInt(0 * BIGINT_CONVERSION_FACTOR),
    raisedTokenAmount: BigInt(0 * BIGINT_CONVERSION_FACTOR),
    softCap: BigInt(0.005 * BIGINT_CONVERSION_FACTOR),
    hardCap: BigInt(0.01 * BIGINT_CONVERSION_FACTOR),
    minInvest: BigInt(0.0001 * BIGINT_CONVERSION_FACTOR),
    maxInvest: BigInt(0.0003 * BIGINT_CONVERSION_FACTOR),
    liquidityWETH9: BigInt(0.01 * BIGINT_CONVERSION_FACTOR),
    liquidityToken: BigInt(200 * BIGINT_CONVERSION_FACTOR),
    privateSaleAmount: 0n,
  },
  poolTime: {
    startTime: BigInt(getUnixTimestampFromDate(new Date())),
    endTime: BigInt(getUnixTimestampFromDate(new Date())),
    startPublicSale: BigInt(getUnixTimestampFromDate(new Date())),
  },
  privateSale: false,
  whitelisted: EMPTY_MERKLE_ROOT,
  action: LiquidityPoolAction.NOTHING,
  lockExpired: 0n,
};
