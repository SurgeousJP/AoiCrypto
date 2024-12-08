import { gql } from "@apollo/client";

export const GET_SELLER_DASHBOARD = gql`
  query GetSellerDashBoard($id: String!) {
    account(id: "$id") {
      poolOwners {
        id
        raised
        idoPool {
          investors {
            id
          }
        }
      }
    }
  }
`;
