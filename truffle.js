const ganache = require("ganache-cli")
const HDWalletProvider = require("truffle-hdwallet-provider")

let mnemonic = process.env.MNEMONIC || 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
let infuraAccessToken = process.env.INFURA_ACCESS_TOKEN || '4XhqRMwcHJht5IC0ImYe'

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 4600000,
      test: true,
    },
    cli: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4600000,
      test: true,
    },
    console: {
      host: "localhost",
      port: 9545,
      network_id: "*",
      gas: 4600000,
      test: true,
    },
    test: {
      network_id: "*",
      provider: ganache.provider(),
      test: true,
    },
    ropsten:  {
      network_id: 3,
      gas: 4600000,
      provider() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraAccessToken}`)
      },
    },
    rinkeby:  {
      network_id: 4,
      gas: 4600000,
      provider() {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${infuraAccessToken}`)
      },
    }
  }
};
