import { gql } from 'apollo-server-micro';
import { AuthType } from 'src/context/AccountContext';

export type LockUtxoParams = {
  auth: AuthType;
  id: String;
  vout: Number;
};

export type UnlockUtxoParams = {
  auth: AuthType;
  lockId: String;
  id: String;
  vout: Number;
};

export const chainTypes = gql`
  type getUtxosType {
    address: String
    address_format: String
    confirmation_count: Int
    output_script: String
    tokens: Int
    transaction_id: String
    transaction_vout: Int
  }
  type sendToType {
    confirmationCount: String
    id: String
    isConfirmed: Boolean
    isOutgoing: Boolean
    tokens: Int
  }

  type getTransactionsType {
    block_id: String
    confirmation_count: Int
    confirmation_height: Int
    created_at: String
    fee: Int
    id: String
    output_addresses: [String]
    tokens: Int
  }

  type LockUtxoType {
    expires_at: String!
    id: String!
  }
`;
