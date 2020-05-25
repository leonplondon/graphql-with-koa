const Koa = require('koa');
const KoaRouter = require('@koa/router');
const koaBody = require('koa-bodyparser');

const { ApolloServer } = require('apollo-server-koa');

const logger = require('./logger')(__filename);

const { ServerConfiguration } = require('./config');
const { typeDefs, resolvers } = require('./graphql');

const app = new Koa();
const router = new KoaRouter();

const server = new ApolloServer({ typeDefs, resolvers });

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
