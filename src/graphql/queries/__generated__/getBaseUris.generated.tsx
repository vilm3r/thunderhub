import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetBaseUrisQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBaseUrisQuery = { __typename?: 'Query' } & {
  getBaseUris?: Types.Maybe<
    { __typename?: 'baseUrisType' } & Pick<
      Types.BaseUrisType,
      'public_key' | 'clear' | 'tor'
    >
  >;
};

export const GetBaseUrisDocument = gql`
  query GetBaseUris {
    getBaseUris {
      public_key
      clear
      tor
    }
  }
`;

/**
 * __useGetBaseUrisQuery__
 *
 * To run a query within a React component, call `useGetBaseUrisQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBaseUrisQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBaseUrisQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBaseUrisQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetBaseUrisQuery,
    GetBaseUrisQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetBaseUrisQuery, GetBaseUrisQueryVariables>(
    GetBaseUrisDocument,
    baseOptions
  );
}
export function useGetBaseUrisLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetBaseUrisQuery,
    GetBaseUrisQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetBaseUrisQuery,
    GetBaseUrisQueryVariables
  >(GetBaseUrisDocument, baseOptions);
}
export type GetBaseUrisQueryHookResult = ReturnType<typeof useGetBaseUrisQuery>;
export type GetBaseUrisLazyQueryHookResult = ReturnType<
  typeof useGetBaseUrisLazyQuery
>;
export type GetBaseUrisQueryResult = ApolloReactCommon.QueryResult<
  GetBaseUrisQuery,
  GetBaseUrisQueryVariables
>;
