import { Address, BigInt } from "@graphprotocol/graph-ts";

export class TokenDetail {
  owner: Address;
  tokenAddress: Address;
  name: String;
  symbol: String;
  maxSupply: BigInt;
  initialSupply: BigInt;
  createdTime: BigInt;
}

export const tokenDetailDefault: TokenDetail = {
  owner: Address.zero(),
  tokenAddress: Address.zero(),
  name: "",
  symbol: "",
  maxSupply: BigInt.zero(),
  initialSupply: BigInt.zero(),
  createdTime: BigInt.zero(),
};
