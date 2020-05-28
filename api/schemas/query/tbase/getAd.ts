import { GraphQLString, GraphQLObjectType } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { toBase } from 'api/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';

const query = `
query getAd {
  getAd {
    name
    text
    url
  }
}
`;

const GetAdType = new GraphQLObjectType({
  name: 'getAdType',
  fields: () => ({
    name: { type: GraphQLString },
    text: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

export const getAd = {
  type: GetAdType,
  resolve: async (_: undefined, params: null, context: ContextType) => {
    const { ip, baseClient } = context;
    await requestLimiter(ip, 'getAd');

    const data = await toBase(baseClient.request(query));

    return data.getAd;
  },
};
