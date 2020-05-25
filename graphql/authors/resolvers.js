const getAuthorByIdUseCase = require('../../useCases/authors/getAuthorByIdUseCase');

module.exports = {
  Query: {
    author: async (root, { filter: { id } }) => getAuthorByIdUseCase.findById(id),
  },
  Mutation: {},
  Subscription: {},
};
