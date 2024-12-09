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

export const GET_PROJECTS_FROM_OWNER = (status: any) => {
  const statusFilter =
    status !== null
      ? `idoType: ${status}`
      : "";
  return gql`
  query Projects(
    $currentTime: BigInt!
    $orderBy: String!
    $orderDirection: String!
    $poolOwner: String!
    $status: String
  ) {
    idopools(
      where: {
        endTime_gt: $currentTime
        searchPoolOwner: $poolOwner
        ${statusFilter}
      }
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
};
