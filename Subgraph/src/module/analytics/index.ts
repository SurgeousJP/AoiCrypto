import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { buildCountFromActivity } from "../count";
import {
  Account,
  AnalysisDaily,
  AnalysisIDODaily,
  IDOPool,
  Investor,
  InvestorActivity,
} from "../../../generated/schema";
import * as activityTypes from "../activity/type";
import * as utils from "../util/index";
import * as helpers from "../helpers/index";

export function trackActivity(
  investorActivity: InvestorActivity,
  idoPoolId: Bytes,
  blockTimestamp: BigInt
): void {
  let idoPool = IDOPool.load(idoPoolId);
  if (idoPool == null) {
    return;
  }

  let count = buildCountFromActivity(investorActivity);
  count.save();

  const volumeAmount =
    investorActivity.type == activityTypes.INVEST ||
    investorActivity.type == activityTypes.CANCEL_INVESTMENT
      ? investorActivity.value
      : BigInt.zero();
  const raisesAmount =
    investorActivity.type == activityTypes.INVEST
      ? investorActivity.value
      : BigInt.zero();

  // Analytics Daily
  updateAnalyticsDayData(blockTimestamp, volumeAmount, raisesAmount);
  // Analytics IDO Daily
  updateAnalyticsIDODayData(
    blockTimestamp,
    idoPool.id,
    volumeAmount,
    raisesAmount
  );
}

export function getAnalyticsId(blockTimestamp: BigInt): Bytes {
  const openDayTime = helpers.time.getDayOpenTime(blockTimestamp);
  const id = Bytes.fromByteArray(Bytes.fromBigInt(openDayTime));

  return id;
}

export function updateAnalyticsDayData(
  blockTimestamp: BigInt,
  amount: BigInt,
  raises: BigInt
): void {
  let analyticsDayData = loadOrCreateAnalyticsDayData(blockTimestamp);
  analyticsDayData.raised = analyticsDayData.raised.plus(raises);
  analyticsDayData.volume = analyticsDayData.raised.plus(amount);
  analyticsDayData.save();
}

export function loadOrCreateAnalyticsDayData(
  blockTimestamp: BigInt
): AnalysisDaily {
  const dayID = getAnalyticsId(blockTimestamp);
  const dayStartTimestamp = helpers.time.getDayOpenTime(blockTimestamp);
  let analyticsDaily = AnalysisDaily.load(dayID);
  if (analyticsDaily == null) {
    analyticsDaily = new AnalysisDaily(dayID);
    analyticsDaily.date = dayStartTimestamp;
    analyticsDaily.raised = BigInt.zero();
    analyticsDaily.volume = BigInt.zero();
  }
  return analyticsDaily;
}

// Analytics for IDO Daily

export function loadOrCreateAnalyticsIDODayData(
  blockTimestamp: BigInt,
  idoPoolId: Bytes
): AnalysisIDODaily {
  const dayID = getAnalyticsId(blockTimestamp);
  const dayStartTimestamp = helpers.time.getDayOpenTime(blockTimestamp);
  let analyticsIDODaily = AnalysisIDODaily.load(dayID);
  if (analyticsIDODaily == null) {
    analyticsIDODaily = new AnalysisIDODaily(dayID);
    analyticsIDODaily.date = dayStartTimestamp;
    analyticsIDODaily.idoPool = idoPoolId;
    analyticsIDODaily.raised = BigInt.zero();
    analyticsIDODaily.volume = BigInt.zero();
  }

  return analyticsIDODaily;
}

export function updateAnalyticsIDODayData(
  blockTimestamp: BigInt,
  idoPoolId: Bytes,
  amount: BigInt,
  raise: BigInt
): void {
  let analyticsIDODaily = loadOrCreateAnalyticsIDODayData(
    blockTimestamp,
    idoPoolId
  );
  analyticsIDODaily.volume = analyticsIDODaily.volume.plus(amount);
  analyticsIDODaily.raised = analyticsIDODaily.raised.plus(raise);
  analyticsIDODaily.save();
}
