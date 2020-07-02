import { gql } from 'apollo-server-micro';

export const tbaseTypes = gql`
  type baseUrisType {
    public_key: String!
    clear: String!
    tor: String!
  }

  type baseNodesType {
    _id: String!
    name: String!
    public_key: String!
    socket: String!
  }

  type baseOfferType {
    _id: String!
    value: Int!
    size: Int!
    available: Boolean!
  }
`;
