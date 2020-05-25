const axios = require('axios');

const { PostServiceConfiguration } = require('../../config');

const findById = async (id) => axios
  .get(PostServiceConfiguration.getPostByIdUrl(id))
  .then((data) => data.data);

module.exports = {
  findById,
};
