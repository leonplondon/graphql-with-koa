const http = require('http');

const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { koaMiddleware } = require('@as-integrations/koa');
const cors = require('@koa/cors');
const Koa = require('koa');
const koaBody = require('koa-bodyparser');
const KoaRouter = require('@koa/router');

const logger = require('./logger')(__filename);

const { ServerConfiguration } = require('./config');
const { typeDefs, resolvers } = require('./graphql');

const app = new Koa();
const router = new KoaRouter();
const httpServer = http.createServer(app.callback());

(async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  router.all('/graphql', koaMiddleware(server));

  app
    .use(cors({
      origin: '*',
      allowMethods: ['GET', 'POST'],
    }))
    .use(koaBody({
      enableTypes: ['json'],
      jsonLimit: 2048,
    }))
    .use(router.routes())
    .use(router.allowedMethods());

  httpServer.listen(
    ServerConfiguration.getPort(),
    () => logger.info(`Server up!!! ${ServerConfiguration.getPort()}`),
  );
})();
