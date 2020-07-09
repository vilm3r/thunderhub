import { ApolloServer, PubSub, gql } from 'apollo-server';
import * as dotenv from 'dotenv';
import {
  authenticatedLndGrpc,
  subscribeToGraph,
  subscribeToChannels,
} from 'ln-service';
import { logger } from '../server/helpers/logger';

const pubsub = new PubSub();

dotenv.config({ path: '.env.local' });

const NODE_UPDATED = 'NODE_UPDATED';
const CHANNEL_STATUS_CHANGE = 'CHANNEL_STATUS_CHANGE';

const typeDefs = gql`
  type Query {
    hello: String
  }
  type Subscription {
    nodeUpdated: NodeUpdate
    channelStatusChange: ChannelStatusChange
  }

  type NodeUpdate {
    alias: String!
    color: String!
    public_key: String!
    sockets: [String]
    updated_at: String!
  }

  type ChannelStatusChange {
    is_active: Boolean!
    transaction_id: String!
    transaction_vout: Int!
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return 'world';
    },
  },
  Subscription: {
    nodeUpdated: {
      subscribe: () => pubsub.asyncIterator([NODE_UPDATED]),
    },
    channelStatusChange: {
      subscribe: () => pubsub.asyncIterator([CHANNEL_STATUS_CHANGE]),
    },
  },
};

const main = async () => {
  const { lnd } = authenticatedLndGrpc({
    cert: process.env.LND_CERT,
    macaroon: process.env.LND_MACAROON,
    socket: process.env.LND_SOCKET,
  });

  const sub = subscribeToGraph({ lnd });
  const subChannels = subscribeToChannels({ lnd });

  // sub.on('channel_closed', channel => {
  //   logger.debug(channel);
  //   pubsub.publish(POST_ADDED, { postAdded: new Date().toISOString() });
  // });

  sub.on('node_updated', node => {
    logger.info(node);
    pubsub.publish(NODE_UPDATED, { nodeUpdated: node });
  });

  subChannels.on('channel_active_changed', channel => {
    logger.info(channel);
    pubsub.publish(CHANNEL_STATUS_CHANGE, { channelStatusChange: channel });
  });

  const cancelSubscriptions = () => {
    sub.removeAllListeners();
  };

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: () => ({ lnd }),
  });

  await server.listen(4000).then(({ url, subscriptionsUrl }) => {
    console.log(`Server available on ${url}`);
    console.log(`Websocket available on ${subscriptionsUrl}`);
  });

  return () => {
    logger.debug('Closing subscriptions');
    cancelSubscriptions();
  };
  // .catch(cancelSubscriptions)
  // .finally(() => {
  //   cancelSubscriptions();
  // });
};

main();
