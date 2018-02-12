var TestHelper = artifacts.require("./TestHelper.sol")
var Spinner = artifacts.require("./Spinner.sol")

module.exports = function(deployer, network) {
  deployer.deploy(Spinner, { overwrite: true })

  if (network != 'live') {
    deployer.deploy(TestHelper)
  }
};
