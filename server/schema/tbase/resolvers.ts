import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { makeQuery } from 'server/helpers/graphql';
import { logger } from 'server/helpers/logger';

export const tbaseResolvers = {
  Query: {
    getBaseNodes: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseNodes');

      const query = '{getNodes {_id, name, public_key, socket}}';

      const [data, errors] = await makeQuery(query);
      if (errors) return [];

      return data?.getNodes || [];
    },
    getBaseOffers: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getBaseOffers');

      const query = '{getOffers {_id, size, value, available}}';

      const [data, errors] = await makeQuery(query);
      if (errors || !data) return [];

      const { getOffers } = data;

      logger.error({ data });
      logger.error({ getOffers });
      return data?.getOffers || [];
    },
    getBaseUris: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'getBaseUris');

      const query = '{getUris {public_key, clear, tor}}';

      const [data, errors] = await makeQuery(query);
      if (errors) return [];

      return data?.getUris || [];
    },
  },
};
