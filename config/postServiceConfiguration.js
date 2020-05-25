class PostServiceConfiguration {
  constructor() {
    this.postsUrl = `${process.env.URL_API}${process.env.POSTS}`;
    this.authorUrl = `${process.env.URL_API}${process.env.AUTHORS}`;
  }

  getPostsUrl() {
    return this.postsUrl;
  }

  getPostByIdUrl(id) {
    return this.postsUrl.concat(id);
  }

  getAuthorByIdUrl(id) {
    return this.authorUrl.concat(id);
  }
}

module.exports = {
  PostServiceConfiguration: new PostServiceConfiguration(),
};
