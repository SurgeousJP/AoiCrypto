import { gql } from "@apollo/client";

export const GET_TOKENS = gql`
  query GetTokens($address: String!) {
    tokens(
      where: { creator_: { address: $address } }
      orderBy: id
      orderDirection: desc
    ) {
      address
      createdTime
      initialSupply
      maxTotalSupply
      name
      symbol
    }
  }
`;

export const GET_ALL_TOKENS = gql`
  query GetAllTokens {
    tokens {
      address
      name
      symbol
    }
  }
`;
