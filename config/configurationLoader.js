/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */


const fs = require('fs');
const path = require('path');

const JS_EXTENSION = '.js';
const CONFIG_LOADER_FILE = 'index.js';

const currentFileName = path.basename(__filename);

const compactConfigurations = (modules) => modules
  .reduce((reduced, current) => ({ ...reduced, ...current }), {});

const isConfigurationFile = (dirent) => {
  const { name: fileName } = dirent;

  return !dirent.isDirectory()
  && path.extname(fileName) === JS_EXTENSION
  && fileName !== currentFileName
  && path.basename(fileName) !== CONFIG_LOADER_FILE;
};

const loadConfigurationModule = (dirent) => require(path.join(__dirname, dirent.name));

const loadConfiguration = () => {
  console.log('Gonna load configuration files');

  const files = fs.readdirSync(__dirname, {
    encoding: null,
    withFileTypes: true,
  });

  const configurationModules = files
    .filter(isConfigurationFile)
    .map(loadConfigurationModule);

  const configurations = compactConfigurations(configurationModules);

  const configuredSources = Object.keys(configurations);
  console.log('Loaded configuration sources', configuredSources);

  return configurations;
};

module.exports = loadConfiguration;
