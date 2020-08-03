import {
  gql,
  MutationFunction,
  useMutation,
  MutationHookOptions,
  BaseMutationOptions,
  MutationResult,
} from '@apollo/client';
import * as Types from '../../types';

export type OpenChannelMutationVariables = Types.Exact<{
  amount: Types.Scalars['Int'];
  partnerPublicKey: Types.Scalars['String'];
  tokensPerVByte?: Types.Maybe<Types.Scalars['Int']>;
  isPrivate?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type OpenChannelMutation = { __typename?: 'Mutation' } & {
  openChannel?: Types.Maybe<
    { __typename?: 'openChannelType' } & Pick<
      Types.OpenChannelType,
      'transactionId' | 'transactionOutputIndex'
    >
  >;
};

export const OpenChannelDocument = gql`
  mutation OpenChannel(
    $amount: Int!
    $partnerPublicKey: String!
    $tokensPerVByte: Int
    $isPrivate: Boolean
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type OpenChannelMutationFn = MutationFunction<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;

/**
 * __useOpenChannelMutation__
 *
 * To run a mutation, you first call `useOpenChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openChannelMutation, { data, loading, error }] = useOpenChannelMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      partnerPublicKey: // value for 'partnerPublicKey'
 *      tokensPerVByte: // value for 'tokensPerVByte'
 *      isPrivate: // value for 'isPrivate'
 *   },
 * });
 */
export function useOpenChannelMutation(
  baseOptions?: MutationHookOptions<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >
) {
  return useMutation<OpenChannelMutation, OpenChannelMutationVariables>(
    OpenChannelDocument,
    baseOptions
  );
}
export type OpenChannelMutationHookResult = ReturnType<
  typeof useOpenChannelMutation
>;
export type OpenChannelMutationResult = MutationResult<OpenChannelMutation>;
export type OpenChannelMutationOptions = BaseMutationOptions<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;
