import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { toBase } from 'api/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';

const mutation = `
mutation createAd($name: String, $text: String!, $url: String, $duration: Int!) {
  createAd(name: $name, text: $text, url: $url, duration: $duration) {
    invoice
    id
  }
}
`;

const CreateAdType = new GraphQLObjectType({
  name: 'createAdType',
  fields: () => {
    return {
      invoice: { type: GraphQLString },
      id: { type: GraphQLString },
    };
  },
});

export const createAd = {
  type: CreateAdType,
  args: {
    name: { type: GraphQLString },
    text: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: GraphQLString },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    const { ip, baseClient } = context;
    await requestLimiter(ip, 'createAd');

    const data = await toBase(baseClient.request(mutation, params));

    return data.createAd;
  },
};
