import { ApolloServer, PubSub, gql } from 'apollo-server';
import * as dotenv from 'dotenv';
import { authenticatedLndGrpc } from 'ln-service';

const pubsub = new PubSub();

dotenv.config({ path: '.env.local' });

const POST_ADDED = 'POST_ADDED';

setInterval(function () {
  pubsub.publish(POST_ADDED, { postAdded: new Date().toISOString() });
}, 3000);

const typeDefs = gql`
  type Query {
    posts: String
  }
  type Subscription {
    postAdded: String
  }
`;

const resolvers = {
  Query: {
    posts: () => {
      return 'Hello';
    },
  },
  Subscription: {
    postAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
};

const main = async () => {
  const { lnd } = authenticatedLndGrpc({
    cert: process.env.LND_CERT,
    macaroon: process.env.LND_MACAROON,
    socket: process.env.LND_SOCKET,
  });

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: () => ({ lnd }),
  });

  await server.listen(4000).then(({ url, subscriptionsUrl }) => {
    console.log(`Server available on ${url}`);
    console.log(`Websocket available on ${subscriptionsUrl}`);
  });
};

main();
