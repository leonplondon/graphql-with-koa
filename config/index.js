const dotEnv = require('dotenv');

const configurationLoader = require('./configurationLoader');

dotEnv.config({
  debug: process.env.NODE_ENV !== 'production',
});

module.exports = configurationLoader();
