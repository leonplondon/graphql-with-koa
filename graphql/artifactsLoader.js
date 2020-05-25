/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const fs = require('fs');
const path = require('path');

const logger = require('../logger')(__filename);

const FILE_TYPES = 'types.js';
const FILE_RESOLVERS = 'resolvers.js';

const mappedTypesAndResolvers = fs
  .readdirSync(__dirname, {
    encoding: null,
    withFileTypes: true,
  })
  .filter((file) => file.isDirectory())
  .map((dir) => {
    logger.info('[GRAPHQL] -> Gonna load types and resolvers from', dir.name);

    const pathToTypes = path.join(__dirname, dir.name, FILE_TYPES);
    const pathToResolvers = path.join(__dirname, dir.name, FILE_RESOLVERS);

    const types = require(pathToTypes);
    const resolvers = require(pathToResolvers);

    logger.info(`[GRAPHQL] -> Loaded types and resolvers from ${dir.name}`);

    return { types, resolvers };
  })
  .reduce((compacted, current) => {
    const newCompacted = {
      types: [...compacted.types, ...current.types],
      resolvers: [...compacted.resolvers, current.resolvers],
    };

    return newCompacted;
  }, { types: [], resolvers: [] });


module.exports = mappedTypesAndResolvers;
