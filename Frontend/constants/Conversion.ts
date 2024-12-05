export const BIGINT_CONVERSION_FACTOR = Math.pow(10, 18);

export const getUnixTimestampFromDate = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const getDateFromUnixTimestamp = (tstamp: BigInt) => {
  return new Date(Number(tstamp) * 1000);
};
