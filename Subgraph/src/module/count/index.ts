import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Count, IDOPool, InvestorActivity } from "../../../generated/schema";
import * as utils from "../util";
import * as idoTypes from "../ido/type";
import * as activityTypes from "../activity/type";

export function buildCount(): Count {
  const id = utils.utils.defaultId;
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

export function buildCountFromIdoPool(idoPool: IDOPool): Count {
  const idoType = idoPool.idoType;
  let count = buildCount();
  if (idoType == idoTypes.PRIVATE_SALE) {
    count.idoPrivateTotal = count.idoPrivateTotal.plus(BigInt.fromI32(1));
  } else if (idoType == idoTypes.PUBLIC_SALE) {
    count.idoPublicTotal = count.idoPublicTotal.plus(BigInt.fromI32(1));
  }
  count.idoTotal = count.idoTotal.plus(BigInt.fromI32(1));

  return count;
}

export function buildCountFromActivity(activity: InvestorActivity): Count {
  let count = buildCount();
  if (activity.type == activityTypes.INVEST) {
    count.investedTotal = count.investedTotal.plus(activity.value);
  } else if (activity.type == activityTypes.CANCEL_INVESTMENT) {
    count.investedTotal = count.investedTotal.minus(activity.value);
  }
  return count;
}

export function buildCountFromListing(idoPool: IDOPool): Count {
  let count = buildCount();
  if (idoPool.raisedAmount.ge(idoPool.softCap)) {
    count.idoSuccessTotal = count.idoSuccessTotal.plus(BigInt.fromI32(1));
  }

  return count;
}
