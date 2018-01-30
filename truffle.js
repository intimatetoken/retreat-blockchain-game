const ganache = require("ganache-cli")

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    // test: {
    //   // host: "localhost",
    //   // port: 7545,
    //   network_id: "*",
    // },
    test: {
      network_id: "*",
      provider: ganache.provider()
    }
  }
};
