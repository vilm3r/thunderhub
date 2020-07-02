import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetBaseOffersQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBaseOffersQuery = { __typename?: 'Query' } & {
  getBaseOffers: Array<
    Types.Maybe<
      { __typename?: 'baseOfferType' } & Pick<
        Types.BaseOfferType,
        '_id' | 'size' | 'value' | 'available'
      >
    >
  >;
};

export const GetBaseOffersDocument = gql`
  query GetBaseOffers {
    getBaseOffers {
      _id
      size
      value
      available
    }
  }
`;

/**
 * __useGetBaseOffersQuery__
 *
 * To run a query within a React component, call `useGetBaseOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBaseOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBaseOffersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBaseOffersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetBaseOffersQuery,
    GetBaseOffersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetBaseOffersQuery,
    GetBaseOffersQueryVariables
  >(GetBaseOffersDocument, baseOptions);
}
export function useGetBaseOffersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetBaseOffersQuery,
    GetBaseOffersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetBaseOffersQuery,
    GetBaseOffersQueryVariables
  >(GetBaseOffersDocument, baseOptions);
}
export type GetBaseOffersQueryHookResult = ReturnType<
  typeof useGetBaseOffersQuery
>;
export type GetBaseOffersLazyQueryHookResult = ReturnType<
  typeof useGetBaseOffersLazyQuery
>;
export type GetBaseOffersQueryResult = ApolloReactCommon.QueryResult<
  GetBaseOffersQuery,
  GetBaseOffersQueryVariables
>;
