import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Token } from "../../../generated/schema";
import { TokenDetail, tokenDetailDefault } from "./type";
import { erc20FactoryContract } from "../util/contract";

export function getTokenId(tokenAddress: Address): Bytes {
  return Bytes.fromHexString(tokenAddress.toHexString());
}

export function loadOrCreateToken(tokenAddress: Address): Token {
  const tokenId = getTokenId(tokenAddress);
  let token = Token.load(tokenId);
  if (token == null) {
    token = new Token(tokenId);
    token.address = tokenAddress;
    token.tokenId = BigInt.zero();
    token.initialSupply = BigInt.zero();
    token.maxTotalSupply = BigInt.zero();
    token.createdTime = BigInt.zero();
  }

  return token;
}

export function getTokenDetail(tokenId: BigInt): TokenDetail {
  const tokenDetailCallResult = erc20FactoryContract.try_getTokenDetail(
    tokenId
  );
  let tokenDetail: TokenDetail = tokenDetailDefault;
  if (tokenDetailCallResult.reverted) {
    log.warning("getTokenDetail call reverted by tokenId {}", [
      tokenId.toHexString(),
    ]);
  } else {
    const value = tokenDetailCallResult.value;
    tokenDetail = {
      owner: value.owner,
      tokenAddress: value.tokenAddress,
      name: value.name,
      symbol: value.symbol,
      maxSupply: value.maxSupply,
      initialSupply: value.initialSupply,
      createdTime: value.createdTime,
    };
  }
  return tokenDetail;
}
