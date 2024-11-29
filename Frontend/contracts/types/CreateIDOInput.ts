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