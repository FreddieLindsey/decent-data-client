const Registry = artifacts.require('../contracts/Registry.sol')
const GMC = artifacts.require('../contracts/GMC.sol')

module.exports = function(deployer) {
  deployer.deploy(Registry);
  deployer.deploy(GMC);
};
