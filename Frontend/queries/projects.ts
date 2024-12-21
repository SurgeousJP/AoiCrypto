import { getUnixTimestampFromDate } from "@/constants/conversion";
import { gql } from "@apollo/client";

export const GET_PROJECT_BY_POOL_ID = gql`
  query GET_PROJECT_BY_POOL_ID($poolId: String!) {
    idopool(id: $poolId) {
      whitelistedRoot
      tokenPool
      startTime
      startPublicSale
      softCap
      searchPoolOwner
      raisedTokenAmount
      raisedAmount
      pricePerToken
      poolId
      poolAddress
      minInvest
      maxInvest
      liquidityWETHAmount
      liquidityTokenAmount
      idoType
      hardCap
      id
      endTime
      createdTime
      liquidityPool {
        action
        lockExpired
      }
      investors {
        id
      }
      poolOwner {
        account {
          address
        }
      }
    }
  }
`;

export const GET_PROJECTS = (status: string | null, stage: string | null) => {
  const stageFilter = stage !== null ? `idoType: ${stage}` : "";
  const currentTime = getUnixTimestampFromDate(new Date());
  let timeFilter = "";
  switch (status) {
    case null:
      break;
    case "Ongoing":
      timeFilter = `endTime_gt: ${currentTime} \n createdTime_lte: ${currentTime}`;
      break;
    case "Upcoming":
      timeFilter = `createdTime_gte: ${currentTime} \n`;
      break;
    case "Ended":
      timeFilter = `endTime_lte: ${currentTime} \n`;
      break;
  }

  return gql`
    query GetAllProjects($orderBy: String!, $orderDirection: String!) {
      idopools(
        where: {
        ${stageFilter}
        ${timeFilter}
      }
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        tokenPool
        startTime
        pricePerToken
        raisedTokenAmount
        raisedAmount
        softCap
        whitelistedRoot
        id
        poolOwner {
          account {
            address
          }
        }
      }
    }
  `;
};

export const GET_PROJECTS_FROM_OWNER = (
  status: string | null,
  stage: string | null
) => {
  const stageFilter = stage !== null ? `idoType: ${stage}` : "";
  const currentTime = getUnixTimestampFromDate(new Date());
  let timeFilter = "";
  switch (status) {
    case null:
      break;
    case "Ongoing":
      timeFilter = `endTime_gt: ${currentTime} \n createdTime_lte: ${currentTime}`;
      break;
    case "Upcoming":
      timeFilter = `createdTime_gte: ${currentTime} \n`;
      break;
    case "Ended":
      timeFilter = `endTime_lte: ${currentTime} \n`;
      break;
  }
  return gql`
  query GetAllProjectsFromOwner(
    $orderBy: String!
    $orderDirection: String!
    $poolOwner: String!
  ) {
    idopools(
      where: {
        searchPoolOwner: $poolOwner
        ${stageFilter}
        ${timeFilter}
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
      startTime
      id
      poolOwner {
        account {
          address
        }
      }
    }
  }
`;
};

export const getTransactionHistory = () => {
  return gql`
    query GetTransactionHistoryFromPool($poolAddress: String!) {
      idopools(where: { poolAddress: $poolAddress }) {
        investorActivities {
          timestamp
          transactionHash
          value
          type
          investor {
            account {
              address
            }
          }
        }
      }
    }
  `;
};

export const getClaimedStatus = () => {
  return gql`
    query GetClaimedStatus($poolAddress: String!, $userAddress: String!) {
      idopools(where: { poolAddress: $poolAddress }) {
        investors(where: { account_: { address: $userAddress } }) {
          claimed
        }
      }
    }
  `;
};
