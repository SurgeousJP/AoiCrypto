import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Count, IDOPool } from "../../../generated/schema";
import * as utils from "../util";
import * as idoTypes from "../ido/type";

export function buildCount(): Count {
  const id = changetype<Bytes>(utils.constants.DEFAULT_ID);
  let count = Count.load(id);
  if (count == null) {
    count = new Count(id);
    count.idoTotal = new BigInt(0);
    count.idoPrivateTotal = new BigInt(0);
    count.idoPublicTotal = new BigInt(0);
    count.idoSuccessTotal = new BigInt(0);
    count.investedTotal = new BigInt(0);
  }

  return count;
}

export function buildCountWhenCreating(idoPool: IDOPool): Count {
  const idoType = idoPool.idoType;
  let count = buildCount();
  if (idoType == idoTypes.PRIVATE_SALE) {
    count.idoPrivateTotal = count.idoPrivateTotal.plus(BigInt.fromI32(1));
  } else if (idoType == idoTypes.PUBLIC_SALE) {
    count.idoPublicTotal = count.idoPublicTotal.plus(BigInt.fromI32(1));
  }
  count.idoTotal = count.idoTotal.plus(BigInt.fromI32(1));

  return count as Count;
}

export function buildCountWhenListing(idoPool: IDOPool): Count {
  let count = buildCount();
  if (idoPool.raisedAmount.ge(idoPool.softCap)) {
    count.idoSuccessTotal = count.idoSuccessTotal.plus(BigInt.fromI32(1));
  }

  return count;
}

export function buildCountWhenInvesting(investedAmount: BigInt): Count {
  let count = buildCount();
  count.investedTotal = count.investedTotal.plus(investedAmount);

  return count;
}

export function buildCountWhenCancelingInvestment(
  investedAmount: BigInt
): Count {
  let count = buildCount();
  count.investedTotal = count.investedTotal.minus(investedAmount);

  return count;
}
