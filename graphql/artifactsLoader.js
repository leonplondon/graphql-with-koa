/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const { gql } = require('apollo-server-koa');
const fs = require('fs');
const path = require('path');

const logger = require('../logger')(__filename);

/**
 * Definition of base resolver to add app-specific dynamically
 */
const BASE_RESOLVERS = [{
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
  Subscription: {
    _empty: () => true,
  },
}];

/**
 * File with resolvers definition on each sub-module
 * @constant
 * @type {String}
 * @default
 */
const FILE_RESOLVERS = 'resolvers.js';

/**
 * Extension files containing GraphQL schemas must have
 * @constant
 * @type {String}
 * @default
 */
const GRAPHQL_FILE_TYPE = '.graphql';

/**
 * Options to read plain-text files
 * @constant
 * @type {Object}
 * @default
 */
const FILE_OPTIONS = {
  encoding: null,
  withFileTypes: true,
};

const compileTypes = (directory) => fs
  .readdirSync(directory, FILE_OPTIONS)
  .filter((object) => object.isFile())
  .filter((file) => file.name.endsWith(GRAPHQL_FILE_TYPE))
  .map((schemaFile) => {
    const shcemaPath = path.join(directory, schemaFile.name);
    return gql(fs.readFileSync(shcemaPath, 'utf-8'));
  });

const mappedTypesAndResolvers = fs
  .readdirSync(__dirname, FILE_OPTIONS)
  .filter((file) => file.isDirectory())
  .map((dir) => {
    logger.info('[GRAPHQL] -> Gonna load types and resolvers from', dir.name);

    const types = compileTypes(path.join(__dirname, dir.name));
    const pathToResolvers = path.join(__dirname, dir.name, FILE_RESOLVERS);

    const resolvers = require(pathToResolvers);

    logger.info(`[GRAPHQL] -> Loaded types and resolvers from ${dir.name}`);

    return {
      resolvers, types,
    };
  })
  .reduce((compacted, current) => ({
    types: [...compacted.types, ...current.types],
    resolvers: [...compacted.resolvers, current.resolvers],
  }), {
    types: compileTypes(__dirname),
    resolvers: BASE_RESOLVERS,
  });


module.exports = mappedTypesAndResolvers;
