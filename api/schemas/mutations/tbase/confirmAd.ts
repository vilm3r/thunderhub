import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { toBase } from 'api/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';

const mutation = `
mutation confirmAd($id: String!) {
  confirmAd(id: $id)
}
`;

type ParamsType = {
  id: string;
};

export const confirmAd = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: ParamsType, context: ContextType) => {
    const { ip, baseClient } = context;
    await requestLimiter(ip, 'confirmAd');

    const data = await toBase(baseClient.request(mutation, params));

    return data.confirmAd;
  },
};
