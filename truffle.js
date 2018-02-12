const ganache = require("ganache-cli")

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 4600000
    },
    test: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 4600000
    },
    // test: {
    //   network_id: "*",
    //   provider: ganache.provider()
    // }
  }
};
