// <---! GUIDELINES !---> //

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

export const sampleCreateIDOInput: CreateIDOInput = {
  poolDetails: {
    tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
    pricePerToken: 1000000000000000000n, // 1 token per ETH (example in wei)
    raisedAmount: 5000000000000000000n, // 5 ETH raised
    raisedTokenAmount: 5000n, // 5000 tokens raised
    softCap: 2000000000000000000n, // 2 ETH
    hardCap: 10000000000000000000n, // 10 ETH
    minInvest: 10000000000000000n, // 0.01 ETH
    maxInvest: 1000000000000000000n, // 1 ETH
    liquidityWETH9: 3000000000000000000n, // 3 ETH liquidity
    liquidityToken: 3000n, // 3000 tokens for liquidity
    privateSaleAmount: 2000n, // 2000 tokens reserved for private sale
  },
  poolTime: {
    startTime: 1700000000000n, // Example timestamp in milliseconds
    endTime: 1700100000000n, // Example timestamp in milliseconds
    startPublicSale: 1700050000000n, // Example timestamp in milliseconds
  },
  privateSale: true,
  whitelisted: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", // Example whitelist address
  action: LiquidityPoolAction.LOCK, // Lock liquidity
  lockExpired: 1700200000000n, // Example timestamp for lock expiration
};
