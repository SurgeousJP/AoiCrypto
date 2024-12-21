import { gql } from "@apollo/client";

export const GET_SELLER_DASHBOARD = gql`
  query GetSellerDashBoard($sellerAddress: String!) {
    idopools(
      where: { searchPoolOwner: $sellerAddress }
    ) {
      investors {
        account {
          address
        }
      }
      raisedAmount
      startTime
      endTime
      tokenPool
    }
  }
`;
