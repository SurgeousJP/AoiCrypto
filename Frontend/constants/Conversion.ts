export const BIGINT_CONVERSION_FACTOR = Math.pow(10, 18);

export function unixToDateTime(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  return date.toLocaleString(); // Returns a string representing the date and time
}