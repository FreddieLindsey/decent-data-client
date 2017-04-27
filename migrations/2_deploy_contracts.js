const IPFSStorage = artifacts.require('../contracts/IPFSStorage.sol')

module.exports = function(deployer) {
  deployer.deploy(IPFSStorage);
};
