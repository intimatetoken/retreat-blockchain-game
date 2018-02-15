const ganache = require("ganache-cli")
const HDWalletProvider = require("truffle-hdwallet-provider")

let mnemonic = process.env.MNEMONIC || '***REMOVED***'
let infuraAccessToken = process.env.INFURA_ACCESS_TOKEN || '4XhqRMwcHJht5IC0ImYe'

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
    },
    ropsten:  {
      network_id: 3,
      gas: 4600000,
      provider() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraAccessToken}`)
      },
    }
  }
};
