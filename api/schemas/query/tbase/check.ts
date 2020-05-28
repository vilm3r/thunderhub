import { GraphQLBoolean } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { toWithError } from 'api/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';

const query = `
query check {
  check
}
`;

export const baseCheck = {
  type: GraphQLBoolean,
  resolve: async (_: undefined, params: null, context: ContextType) => {
    const { ip, baseClient } = context;
    await requestLimiter(ip, 'check');

    const [, error] = await toWithError(baseClient.request(query));

    return error ? false : true;
  },
};
