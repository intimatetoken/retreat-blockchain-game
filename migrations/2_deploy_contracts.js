var Ownable = artifacts.require("zeppelin-solidity/contracts/ownership/Ownable.sol")
var Destructible = artifacts.require("zeppelin-solidity/contracts/lifecycle/Destructible.sol")

var TestHelper = artifacts.require("./TestHelper.sol")

var Throw = artifacts.require("./Throw.sol")

module.exports = function(deployer, network) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Destructible)
  deployer.deploy(Destructible)
  deployer.link(Destructible, Throw)
  deployer.deploy(Throw)

  if (network != 'live') {
    deployer.deploy(TestHelper)
  }
};
