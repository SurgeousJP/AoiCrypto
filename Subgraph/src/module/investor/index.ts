import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Investor } from "../../../generated/schema";
import { createOrLoadAccount, getAccountId } from "../account";
import { getIDOPoolId } from "../ido";

export function getInvestorId(
  investorAddress: Address,
  idoPoolAddress: Address
): Bytes {
  return Bytes.fromHexString(investorAddress.toHexString()).concat(
    Bytes.fromHexString(idoPoolAddress.toHexString())
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
    let account = createOrLoadAccount(investorAddress);
    investor.account = account.id;
    investor.idoPool = getIDOPoolId(idoPoolAddress);
    investor.investedAmount = BigInt.zero();
    investor.registered = false;
    investor.claimed = false;
    investor.save();
  }

  log.info("Loading investor: {}", [
    investorAddress.toHexString(),
    investor.claimed.toString(),
  ]);
  return investor;
}
