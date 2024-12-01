export type CreateNewERC20Input = {
  name: string,
  symbol: string,
  maxTotalSupply: bigint,
  initialSupply: bigint
}

export const sampleCreateNewERC20Input: CreateNewERC20Input = {
  name: "Elysia",
  symbol: "ELY",
  maxTotalSupply: 10000n,
  initialSupply: 5000n
};
