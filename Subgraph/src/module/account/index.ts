import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Account } from "../../../generated/schema";

export function getAccountId(accountAddress: Address): Bytes {
  return changetype<Bytes>(accountAddress);
}

export function createOrLoadAccount(accountAddress: Address): Account {
  const accountId = getAccountId(accountAddress);
  let account = Account.load(accountId);
  if (account == null) {
    account = new Account(accountId);
    account.address = accountAddress;
    account.investedTotal = new BigInt(0);
    account.investedTotalAmount = new BigInt(0);
    account.raisedTotal = new BigInt(0);
    account.raisedTotalAmount = new BigInt(0);
    account.save();
  }

  log.info("Loading account: {}", [
    account.address.toHexString(),
    account.investedTotal.toHexString(),
    account.investedTotalAmount.toHexString(),
    account.raisedTotal.toHexString(),
    account.raisedTotalAmount.toHexString(),
  ]);

  return account;
}
