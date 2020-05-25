class ServerConfiguration {
  constructor() {
    this.port = process.env.PORT || 3000;
  }

  getPort() {
    return this.port;
  }
}

module.exports = {
  ServerConfiguration: new ServerConfiguration(),
};
