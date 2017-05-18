const StringUtil = artifacts.require('../contracts/libraries/StringUtil.sol')

module.exports = function(deployer) {
  deployer.deploy(StringUtil);
};
