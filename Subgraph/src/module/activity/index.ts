import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Investor, InvestorActivity } from "../../../generated/schema";
import * as activityTypes from "./type";

export function getActivityId(
  investor: Investor,
  blockTimestamp: BigInt
): Bytes {
  return investor.account
    .concat(investor.idoPool)
    .concat(changetype<Bytes>(blockTimestamp));
}

export function createInvestorActivity(
  investor: Investor,
  type: activityTypes.ActivityType,
  value: BigInt,
  blockTimestamp: BigInt
): InvestorActivity {
  const activityId = getActivityId(investor, blockTimestamp);

  let activity = new InvestorActivity(activityId);
  activity.investor = investor.id;
  activity.value = value;
  // activity.type = type;
  switch (type) {
    case activityTypes.ActivityType.INVEST: {
      activity.type = activityTypes.INVEST;
      break;
    }
    case activityTypes.ActivityType.CANCEL_INVESTMENT: {
      activity.type = activityTypes.CANCEL_INVESTMENT;
      break;
    }
    case activityTypes.ActivityType.CLAIM: {
      activity.type = activityTypes.CLAIM;
      break;
    }
    case activityTypes.ActivityType.REFUND: {
      activity.type = activityTypes.REFUND;
      break;
    }
  }

  return activity;
}
