import { ContextType } from 'server/types/apiTypes';
import { getLnd } from 'server/helpers/helpers';
import { rebalance, swapOut } from 'balanceofsatoshis/swaps';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { AuthType } from 'src/context/AccountContext';

const TEN_HOUR_TIMEOUT = 3.6e7;

type SwapOutType = {
  auth: AuthType;
  api_key?: String;
  avoid?: String[];
  // confs?: Number;
  is_fast?: Boolean;
  is_dry_run?: Boolean;
  // is_raw_recovery_shown?: Boolean;
  max_fee?: Number;
  max_paths?: Number;
  max_wait_blocks?: Number;
  node?: String;
  out_address?: String;
  peer?: String;
  recovery?: String;
  socket?: String;
  spend_address?: String;
  spend_tokens?: Number;
  // timeout?: Number;
  tokens?: Number;
};

type RebalanceType = {
  auth: AuthType;
  avoid?: String[];
  in_through?: String;
  is_avoiding_high_inbound?: Boolean;
  max_fee?: Number;
  max_fee_rate?: Number;
  max_rebalance?: Number;
  node?: String;
  out_channels?: String[];
  out_through?: String;
  target?: Number;
};

export const bosResolvers = {
  Mutation: {
    bosSwapOut: async (
      _: undefined,
      params: SwapOutType,
      context: ContextType
    ) => {
      const { auth, ...extraparams } = params;
      const lnd = getLnd(auth, context);

      const response = await to(
        swapOut({
          lnd,
          logger,
          ...extraparams,
          confs: 1,
          timeout: TEN_HOUR_TIMEOUT,
          is_raw_recovery_shown: true,
          is_dry_run: true,
        })
      );

      console.log({ response });

      return true;
    },
    bosRebalance: async (
      _: undefined,
      params: RebalanceType,
      context: ContextType
    ) => {
      const { auth, ...extraparams } = params;
      const lnd = getLnd(auth, context);

      const response = await to(
        rebalance({
          lnd,
          logger,
          ...extraparams,
        })
      );

      const result = {
        increase: response.rebalance[0],
        decrease: response.rebalance[1],
        result: response.rebalance[2],
      };

      return result;
    },
  },
};
