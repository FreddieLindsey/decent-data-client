const IPFSStorage = artifacts.require('../contracts/IPFSStorage.sol')
const Registry = artifacts.require('../contracts/Registry.sol')
const Group = artifacts.require('../contracts/Group.sol')

const StringUtil = artifacts.require('../contracts/libraries/StringUtil.sol')

module.exports = function(deployer) {
  deployer.link(StringUtil, IPFSStorage);

  deployer.deploy(IPFSStorage);
  deployer.deploy(Registry);
  deployer.deploy(Group);
};
