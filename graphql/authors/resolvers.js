const logger = require('../../logger')(__filename);

const getAuthorByIdUseCase = require('../../useCases/authors/getAuthorByIdUseCase');

module.exports = {
  Query: {
    author: async (root, { filter: { id } }) => {
      logger.info('Gonna execute author query', { authorId: id });
      return getAuthorByIdUseCase.findById(id);
    },
  },
  Mutation: {},
  Subscription: {},
};
