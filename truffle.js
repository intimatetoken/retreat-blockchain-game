const ganache = require("ganache-cli")

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 4600000
    },
    'ganache-cli': {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4600000
    },
    console: {
      host: "localhost",
      port: 9545,
      network_id: "*",
      gas: 4600000
    },
    test: {
      network_id: "*",
      provider: ganache.provider()
    }
  }
};
