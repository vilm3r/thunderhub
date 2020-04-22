import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

export default function createApolloClient(initialState, ctx) {
  const ssrMode = Boolean(ctx);
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.

  const httplink = new HttpLink({
    uri: 'http://localhost:3000/api/v1', // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    fetch,
  });

  let link;

  if (ssrMode) {
    link = httplink;
  } else {
    const client = new SubscriptionClient('ws://localhost:3000/api/v1', {
      reconnect: true,
    });

    const wsLink = new WebSocketLink(client);

    link = split(
      // only create the split in the browser
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httplink
    );
  }

  return new ApolloClient({
    // ssrMode: Boolean(ctx),
    // link: new HttpLink({
    //   uri: 'http://localhost:3000/api/v1', // Server URL (must be absolute)
    //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    //   fetch,
    // }),
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}
