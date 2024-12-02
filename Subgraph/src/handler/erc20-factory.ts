import { Address, Bytes } from "@graphprotocol/graph-ts";
import { TokenCreated } from "../../generated/ERC20Factory/ERC20Factory";
import { getTokenDetail, loadOrCreateToken } from "../module/token";

export function handleTokenCreated(event: TokenCreated): void {
  const owner = event.params.owner;
  const tokenAddress = event.params.token;
  const tokenId = event.params.tokenId;
  const tokenDetail = getTokenDetail(tokenId);
  if (tokenDetail.tokenAddress.equals(Address.zero())) {
    return;
  }
  let token = loadOrCreateToken(tokenAddress);
  token.creator = owner;
  token.tokenId = tokenId;
  token.createdTime = event.block.timestamp;
  token.initialSupply = tokenDetail.initialSupply;
  token.maxTotalSupply = tokenDetail.maxSupply;
  token.save();
}
