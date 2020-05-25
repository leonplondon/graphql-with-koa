const { gql } = require('apollo-server-koa');

const rootTypes = gql`
  extend type Query {
    posts: [Post!]!
    post(id: ID!): Post!
  }

  extend type Mutation {
    createPost(post: PostInput!): ID!
  }
`;

const customTypes = gql`
  type Post {
    id: ID!
    userId: String!
    title: String!
    body: String!
    author: Author!
  }
`;

const inputTypes = gql`
  input PostInput {
    author: Int!
    body: String!
    title: String!
    userId: Int!
  } 
`;

module.exports = [
  customTypes,
  inputTypes,
  rootTypes,
];
