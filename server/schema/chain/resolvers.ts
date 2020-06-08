import {
  getChainBalance as getBalance,
  getPendingChainBalance as getPending,
  getChainTransactions,
  getUtxos,
  sendToChainAddress,
  createChainAddress,
  lockUtxo,
  unlockUtxo,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getLnd } from 'server/helpers/helpers';
import { sortBy } from 'underscore';
import { to } from 'server/helpers/async';
import { LockUtxoParams, UnlockUtxoParams } from './types';

interface ChainBalanceProps {
  chain_balance: number;
}

interface PendingChainBalanceProps {
  pending_chain_balance: number;
}

export const chainResolvers = {
  Query: {
    getChainBalance: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainBalance');

      const lnd = getLnd(params.auth, context);

      const { chain_balance }: ChainBalanceProps = await to(
        getBalance({
          lnd,
        })
      );
      return chain_balance;
    },
    getPendingChainBalance: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'pendingChainBalance');

      const lnd = getLnd(params.auth, context);

      const { pending_chain_balance }: PendingChainBalanceProps = await to(
        getPending({
          lnd,
        })
      );
      return pending_chain_balance;
    },
    getChainTransactions: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainTransactions');

      const lnd = getLnd(params.auth, context);

      const transactionList = await to(
        getChainTransactions({
          lnd,
        })
      );

      const transactions = sortBy(
        transactionList.transactions,
        'created_at'
      ).reverse();
      return transactions;
    },
    getUtxos: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getUtxos');

      const lnd = getLnd(params.auth, context);

      const { utxos } = await to(getUtxos({ lnd }));

      return utxos;
    },
  },
  Mutation: {
    createAddress: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getAddress');

      const lnd = getLnd(params.auth, context);

      const format = params.nested ? 'np2wpkh' : 'p2wpkh';

      const { address } = await to(
        createChainAddress({
          lnd,
          is_unused: true,
          format,
        })
      );

      return address;
    },
    sendToAddress: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'sendToAddress');

      const lnd = getLnd(params.auth, context);

      const props = params.fee
        ? { fee_tokens_per_vbyte: params.fee }
        : params.target
        ? { target_confirmations: params.target }
        : {};

      const sendAll = params.sendAll ? { is_send_all: true } : {};

      const send = await to(
        sendToChainAddress({
          lnd,
          address: params.address,
          ...(params.tokens && { tokens: params.tokens }),
          ...props,
          ...sendAll,
        })
      );

      return {
        confirmationCount: send.confirmation_count,
        id: send.id,
        isConfirmed: send.is_confirmed,
        isOutgoing: send.is_outgoing,
        ...(send.tokens && { tokens: send.tokens }),
      };
    },
    lockUtxo: async (
      _: undefined,
      params: LockUtxoParams,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'lockUtxo');

      const { auth, id, vout } = params;
      const lnd = getLnd(auth, context);

      return await to(
        lockUtxo({ lnd, transaction_id: id, transaction_vout: vout })
      );
    },
    unlockUtxo: async (
      _: undefined,
      params: UnlockUtxoParams,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'unlockUtxo');

      const { auth, id, vout, lockId } = params;
      const lnd = getLnd(auth, context);

      await to(
        unlockUtxo({
          lnd,
          id: lockId,
          transaction_id: id,
          transaction_vout: vout,
        })
      );

      return true;
    },
  },
};
