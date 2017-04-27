const SimpleStorage = artifacts.require('../contracts/SimpleStorage.sol')
const IPFSStorage = artifacts.require('../contracts/IPFSStorage.sol')

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(IPFSStorage);
};
