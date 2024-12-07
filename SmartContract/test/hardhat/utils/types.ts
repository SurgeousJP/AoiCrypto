import { ethers } from "hardhat";

export type IDOPoolDetails = {
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

export type IDOTime = {
  startTime: number;
  endTime: number;
  startPublicSale: number;
};

export enum IDOType {
  PUBLIC_SALE,
  PRIVATE_SALE,
}
