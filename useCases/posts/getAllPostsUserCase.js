const axios = require('axios');

const { PostServiceConfiguration } = require('../../config');

const findAll = () => axios
  .get(PostServiceConfiguration.getPostsUrl())
  .then((data) => data.data);

module.exports = {
  findAll,
};
