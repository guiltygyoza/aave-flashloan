var FlashLoanReceiverArb = artifacts.require("./FlashLoanReceiverArb.sol");

module.exports = function(deployer) {
  deployer.deploy(FlashLoanReceiverArb, "0x43CD3224f8c81B096F4C9862ef6817e66c5B70B9");
};
