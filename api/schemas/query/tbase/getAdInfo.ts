import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { toBase } from 'api/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';

const query = `
query getAdInfo {
  getAdInfo {
    queueSeconds
    ratePerSecond
  }
}
`;

const GetAdInfoType = new GraphQLObjectType({
  name: 'getAdInfoType',
  fields: () => ({
    queueSeconds: { type: GraphQLInt },
    ratePerSecond: { type: GraphQLInt },
  }),
});

export const getAdInfo = {
  type: GetAdInfoType,
  resolve: async (_: undefined, params: null, context: ContextType) => {
    const { ip, baseClient } = context;
    await requestLimiter(ip, 'getAdInfo');

    const data = await toBase(baseClient.request(query));

    return data.getAdInfo;
  },
};
