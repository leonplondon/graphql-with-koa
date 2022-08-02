const { ApolloServer } = require('apollo-server-koa');

const Koa = require('koa');
const koaBody = require('koa-bodyparser');
const KoaRouter = require('@koa/router');

const logger = require('./logger')(__filename);

const { ServerConfiguration } = require('./config');
const { typeDefs, resolvers } = require('./graphql');

const app = new Koa();
const router = new KoaRouter();

(async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    playground: process.env.NODE_ENV !== 'production',
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: {
      allowMethods: ['post', 'get'],
      origin: '*',
    },
    path: '/graphql',
  });

  app
    .use(koaBody({
      enableTypes: ['json'],
      jsonLimit: 2048,
    }))
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(
    ServerConfiguration.getPort(),
    () => logger.info(`Server up!!! ${ServerConfiguration.getPort()}`),
  );
})();
