import { Address, Bytes, log } from "@graphprotocol/graph-ts";
import { TokenCreated } from "../../generated/ERC20Factory/ERC20Factory";
import { getTokenDetail, loadOrCreateToken } from "../module/token";
import { createOrLoadAccount } from "../module/account";

export function handleTokenCreated(event: TokenCreated): void {
  const owner = event.params.owner;
  const tokenAddress = event.params.token;
  const tokenId = event.params.tokenId;

  let account = createOrLoadAccount(owner);

  const tokenDetail = getTokenDetail(tokenId);

  log.info("tokenDetail {}", [
    tokenDetail.name.toString(),
    tokenDetail.symbol.toString(),
  ]);

  if (tokenAddress.equals(Address.zero())) {
    log.warning(
      "tokenAddress in tokenDetail of tokenId {} equals Zero Address",
      [tokenDetail.tokenAddress.toHexString()]
    );
    return;
  }
  let token = loadOrCreateToken(tokenAddress);
  token.creator = account.id;
  token.tokenId = tokenId;
  token.name = tokenDetail.name.toString();
  token.symbol = tokenDetail.symbol.toString();
  token.createdTime = event.block.timestamp;
  token.initialSupply = tokenDetail.initialSupply;
  token.maxTotalSupply = tokenDetail.maxSupply;
  token.save();

  log.info("Account {} created token {}: {}", [
    owner.toHexString(),
    tokenAddress.toHexString(),
    [
      tokenId.toHexString(),
      token.name,
      token.symbol,
      token.initialSupply.toHexString(),
      token.maxTotalSupply.toHexString(),
    ].toString(),
  ]);

  account.save();
}
