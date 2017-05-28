const IPFSStorage = artifacts.require('IPFSStorage')
const Registry = artifacts.require('Registry')
const Group = artifacts.require('Group')

module.exports = function(deployer) {
  deployer.deploy(IPFSStorage).then(() => {
    deployer.link(IPFSStorage, Registry);
    return deployer.deploy(Registry);
  });

  deployer.deploy(Group);
};
