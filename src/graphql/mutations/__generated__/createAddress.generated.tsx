import {
  gql,
  MutationFunction,
  useMutation,
  MutationHookOptions,
  BaseMutationOptions,
  MutationResult,
} from '@apollo/client';
import * as Types from '../../types';

export type CreateAddressMutationVariables = Types.Exact<{
  nested?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type CreateAddressMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'createAddress'
>;

export const CreateAddressDocument = gql`
  mutation CreateAddress($nested: Boolean) {
    createAddress(nested: $nested)
  }
`;
export type CreateAddressMutationFn = MutationFunction<
  CreateAddressMutation,
  CreateAddressMutationVariables
>;

/**
 * __useCreateAddressMutation__
 *
 * To run a mutation, you first call `useCreateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAddressMutation, { data, loading, error }] = useCreateAddressMutation({
 *   variables: {
 *      nested: // value for 'nested'
 *   },
 * });
 */
export function useCreateAddressMutation(
  baseOptions?: MutationHookOptions<
    CreateAddressMutation,
    CreateAddressMutationVariables
  >
) {
  return useMutation<CreateAddressMutation, CreateAddressMutationVariables>(
    CreateAddressDocument,
    baseOptions
  );
}
export type CreateAddressMutationHookResult = ReturnType<
  typeof useCreateAddressMutation
>;
export type CreateAddressMutationResult = MutationResult<CreateAddressMutation>;
export type CreateAddressMutationOptions = BaseMutationOptions<
  CreateAddressMutation,
  CreateAddressMutationVariables
>;
