var TestHelper = artifacts.require("./TestHelper.sol")
var Spinner = artifacts.require("./Spinner.sol")
let networks = require('../truffle').networks

module.exports = function(deployer, network) {
  deployer.deploy(Spinner)
  networks[network].test && deployer.deploy(TestHelper)
};
