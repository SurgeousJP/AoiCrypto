import { gql } from "@apollo/client";

export const GET_INVESTED_PROJECT = gql`
  query GetInvestedProjectQuery($id: String!) {
    account(id: $id) {
      investors {
        idoPool {
          endTime
          id
          startPublicSale
          startTime
          tokenPool
        }
        claimed
        activities {
          timestamp
          value
          type
        }
      }
    }
  }
`;
export const GET_INVESTED_TOKEN = gql`
  query GetTokenQuery($tokenIds: [String!]) {
    tokens(where: { id_in: $tokenIds }) {
      id
      name
      symbol
    }
  }
`;
