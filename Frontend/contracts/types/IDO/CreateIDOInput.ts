// <---! GUIDELINES !---> //

import { BIGINT_CONVERSION_FACTOR, getUnixTimestampFromDate } from "@/constants/conversion";

// SOLIDITY TYPES => TYPESCRIPT TYPES
// address => string
// uint256 => bigint
// datetime => unix => bigint
// bytes32 => string (hexadecimal representation)
// enums => enums (nothing changes)

// <---! GUIDELINES !---> //

export type CreateIDOInput = {
  poolDetails: PoolDetails,
  poolTime: PoolTime,
  privateSale: boolean,
  whitelisted: string,
  action: LiquidityPoolAction,
  lockExpired: bigint
}

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
  BURN
}

const createEmptyPoolDetails = (): PoolDetails => ({
  tokenAddress: '',
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

const createEmptyPoolTime = (): PoolTime => ({
  startTime: 0n,
  endTime: 0n,
  startPublicSale: 0n,
});

export const createDefaultCreateIDOInput = (): CreateIDOInput => ({
  poolDetails: createEmptyPoolDetails(),
  poolTime: createEmptyPoolTime(),
  privateSale: false,  
  whitelisted: '',  
  action: LiquidityPoolAction.NOTHING,  
  lockExpired: 0n, 
});

export const sampleCreateIDOInput: CreateIDOInput = {
  poolDetails: {
    tokenAddress: "0x82a9d5f57483163de82ef5d40d045be974d9d215",
    pricePerToken: BigInt(0.001 * BIGINT_CONVERSION_FACTOR), 
    raisedAmount: BigInt(0), 
    raisedTokenAmount: BigInt(0), 
    softCap: BigInt(5 * BIGINT_CONVERSION_FACTOR), 
    hardCap: BigInt(10 * BIGINT_CONVERSION_FACTOR),
    minInvest: BigInt(0.05 * BIGINT_CONVERSION_FACTOR),
    maxInvest: BigInt(0.1 * BIGINT_CONVERSION_FACTOR),
    liquidityWETH9: BigInt(2 * BIGINT_CONVERSION_FACTOR), 
    liquidityToken: BigInt(Math.pow(10, 7) * BIGINT_CONVERSION_FACTOR), 
    privateSaleAmount: BigInt(0),
  },
  poolTime: {
    startTime: BigInt(getUnixTimestampFromDate(new Date(2024, 4 - 1, 12))),
    endTime: BigInt(getUnixTimestampFromDate(new Date(2024, 11 - 1, 12))), 
    startPublicSale: BigInt(0),
  },
  privateSale: false,
  whitelisted: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", // Example whitelist address
  action: LiquidityPoolAction.NOTHING, // Lock liquidity
  lockExpired: 1700200000000n, // Example timestamp for lock expiration
};
