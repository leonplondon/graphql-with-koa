const baseResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
  Subscription: {
    _empty: () => true,
  },
};

module.exports = baseResolvers;
