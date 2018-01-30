var Ownable = artifacts.require("zeppelin-solidity/contracts/ownership/Ownable.sol")
var Destructible = artifacts.require("zeppelin-solidity/contracts/lifecycle/Destructible.sol")

var TestHelper = artifacts.require("./TestHelper.sol")

var Throw = artifacts.require("./Throw.sol")
var Spinner = artifacts.require("./Spinner.sol")

module.exports = function(deployer, network) {
  deployer.deploy(Ownable)

  deployer.link(Ownable, Destructible)
  deployer.deploy(Destructible)

  deployer.link(Destructible, Throw)
  deployer.deploy(Throw)

  deployer.link(Throw, Spinner)
  deployer.deploy(Spinner)

  if (network != 'live') {
    deployer.deploy(TestHelper)
  }
};
