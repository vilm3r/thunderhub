import gql from 'graphql-tag';

export const GET_BASE_OFFERS = gql`
  query GetBaseOffers {
    getBaseOffers {
      _id
      size
      value
      available
    }
  }
`;
