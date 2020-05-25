const { gql } = require('apollo-server-koa');

const rootTypes = gql`
  extend type Query {
    author(filter: AuthorFilter!): Author!
  }
`;

const customTypes = gql`
  type Author {
    id: Int!
    name: String!
    username: String
    email: String
    website: String
  }
`;

const inputTypes = gql`
  input AuthorFilter {
    id: Int!
    active: Boolean
  }
`;

module.exports = [
  rootTypes,
  customTypes,
  inputTypes,
];
