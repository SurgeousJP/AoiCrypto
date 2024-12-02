import { BigInt } from "@graphprotocol/graph-ts";
import * as utils from "../util/index";

export function getOpenTime(timestamp: BigInt, interval: BigInt): BigInt {
  let excess = timestamp.mod(interval);
  return timestamp.minus(excess);
}

export function getDayOpenTime(timestamp: BigInt): BigInt {
  let interval = utils.constants.DAY;
  return getOpenTime(timestamp, interval);
}
