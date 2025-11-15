class MockConnection {
  constructor(opts) {
    this.loginUrl = opts.loginUrl;
    this.login = jest.fn();
    this.accessToken = null;
  }
}

module.exports = {
  Connection: MockConnection
};
