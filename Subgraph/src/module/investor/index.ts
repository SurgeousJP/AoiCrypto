import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Account, Investor } from "../../../generated/schema";

export function getInvestorId(
  investorAddress: Address,
  idoPoolAddress: Address
): Bytes {
  return changetype<Bytes>(
    idoPoolAddress.toHexString() + investorAddress.toHexString()
  );
}

export function createOrLoadInvestor(
  investorAddress: Address,
  idoPoolAddress: Address
): Investor {
  const investorId = getInvestorId(investorAddress, idoPoolAddress);
  let investor = Investor.load(investorId);

  if (investor == null) {
    investor = new Investor(investorId);
    investor.account = changetype<Bytes>(investorAddress);
    investor.idoPool = changetype<Bytes>(idoPoolAddress);
    investor.investedAmount = new BigInt(0);
    investor.investedTokenAmount = new BigInt(0);
    investor.claimed = false;
    investor.save();
  }

  log.info("Loading investor: {}", [
    investorAddress.toHexString(),
    investor.investedAmount.toHexString(),
    investor.investedTokenAmount.toHexString(),
    investor.claimed.toString(),
  ]);
  return investor;
}
