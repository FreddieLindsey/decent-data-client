const IPFSStorage = artifacts.require('../contracts/IPFSStorage.sol')
const Registry = artifacts.require('../contracts/Registry.sol')

module.exports = function(deployer) {
  deployer.deploy(IPFSStorage);
  deployer.deploy(Registry);
};
