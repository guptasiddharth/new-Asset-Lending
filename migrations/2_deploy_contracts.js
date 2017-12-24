var AssetLending = artifacts.require("./AssetLending.sol");


module.exports = function(deployer) {
  deployer.deploy(AssetLending);
 
};
