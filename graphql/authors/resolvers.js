const logger = require('../../logger')(__filename);

const authorByIdUseCase = require('../../useCases/authors/getAuthorByIdUseCase');

module.exports = {
  Query: {
    author: async (_root, { filter: { id } }) => {
      logger.info('Gonna execute author query', { authorId: id });
      return authorByIdUseCase.findById(id);
    },
  },
  Mutation: {},
  Subscription: {},
};
