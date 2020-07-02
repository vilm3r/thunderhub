import gql from 'graphql-tag';

export const GET_BASE_URIS = gql`
  query GetBaseUris {
    getBaseUris {
      public_key
      clear
      tor
    }
  }
`;
