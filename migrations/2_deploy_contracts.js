const IPFSStorage = artifacts.require('IPFSStorage')
const Registry = artifacts.require('Registry')
const Group = artifacts.require('Group')

const StringUtil = artifacts.require('libraries/StringUtil')

module.exports = function(deployer) {
  deployer.deploy(StringUtil);
  deployer.link(StringUtil, IPFSStorage);

  deployer.deploy(IPFSStorage);
  deployer.deploy(Registry);
  deployer.deploy(Group);
};
