const getPostByIdUseCase = require('../../useCases/posts/getPostByIdUseCase');
const getAllPostsUseCase = require('../../useCases/posts/getAllPostsUserCase');
const getAuthorByIdUseCase = require('../../useCases/authors/getAuthorByIdUseCase');

module.exports = {
  Query: {
    posts: async () => getAllPostsUseCase.findAll(),
    post: async (_root, { id }) => getPostByIdUseCase.findById(id),
  },
  Post: {
    author: async ({ userId }) => getAuthorByIdUseCase.findById(userId),
  },
  Mutation: {
    createPost: async (_root, { post }) => post.title,
  },
  Subscription: {},
};
