const IPFSStorage = artifacts.require('../contracts/IPFSStorage.sol')
const Registry = artifacts.require('../contracts/Registry.sol')
const Group = artifacts.require('../contracts/Group.sol')

module.exports = function(deployer) {
  deployer.deploy(IPFSStorage);
  deployer.deploy(Registry);
  deployer.deploy(Group);
};
