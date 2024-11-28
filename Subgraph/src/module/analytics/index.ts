import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { buildCountWhenInvesting } from "../count";
import { Account, IDOPool, Investor } from "../../../generated/schema";
import { createOrLoadInvestor } from "../investor";

export function trackInvestment(
  account: Account,
  investorAddress: Address,
  idoPool: IDOPool,
  amountInvest: BigInt,
  amountTokenInvest: BigInt,
  timestamp: BigInt
): void {
  if (amountInvest.isZero()) {
    return;
  }
  let count = buildCountWhenInvesting(amountInvest);
  count.save();

  // let investor = createOrLoadInvestor(investorAddress, idoPool.);
  // investor.save();

  // let;
}
