const StringUtil = artifacts.require('libraries/StringUtil')

module.exports = function(deployer) {
  deployer.deploy(StringUtil);
};
