const baseTypes = require('./baseTypes');
const baseRoots = require('./baseResolvers');

const { types, resolvers } = require('./artifactsLoader');

module.exports = {
  typeDefs: [baseTypes, ...types],
  resolvers: [baseRoots, ...resolvers],
};
