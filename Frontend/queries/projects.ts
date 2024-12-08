import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query Projects(
    $currentTime: BigInt!
    $orderBy: String!
    $orderDirection: String!
  ) {
    idopools(
      where: { endTime_gt: $currentTime }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      tokenPool
      pricePerToken
      raisedTokenAmount
      raisedAmount
      softCap
      whitelistedRoot
    }
  }
`;
