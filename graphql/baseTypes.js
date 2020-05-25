const { gql } = require('apollo-server-koa');

const baseTypes = gql`
  type Query {
    _empty: Boolean!
  }

  type Mutation {
    _empty: Boolean!
  }

  type Subscription {
    _empty: Boolean!
  }
`;

module.exports = baseTypes;
