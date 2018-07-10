var SirinCrowdsale = artifacts.require("./Crowdsale/SirinCrowdsale.sol");
var SirinSmartToken = artifacts.require("SirinSmartToken.sol");
var RefundVault = artifacts.require("RefundVault");
var MultiSig = artifacts.require("./multisig/MultiSigWallet.sol");

module.exports = (deployer, network, accounts) => {

    const MIN = 60;
    const HOUR = 60 * MIN;
    const DAY = 24 * HOUR;

    // TODO: Change to actual address' before deploy !!!!!!!! 
    const multiSigOwnerList = ["0x25a9f7512f28265Cb2772dE07DD947F969E19F49", "0xEeA15379f5EE76e6C4c829D1853355A6DA8575df"]  

    var token, vault, sale, multiSig;

    const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 60 * 3;
    const endTime = startTime + MIN * 75; //+ DAY * 14;
    const rate = new web3.BigNumber(1000);
    const wallet = accounts[0];
    var token, refundVault;
    deployer.deploy(MultiSig, multiSigOwnerList, 2).then(function () {
        return deployer.deploy(SirinSmartToken).then(function () {
            return deployer.deploy(RefundVault, MultiSig.address, SirinSmartToken.address).then(function () {
                return deployer.deploy(SirinCrowdsale,
                    startTime,
                    endTime,                  
                    MultiSig.address,
                    SirinSmartToken.address,
                    RefundVault.address, { gas: 6900000 });
            });
        });
    });

    deployer.then(function () {
        return SirinSmartToken.deployed();
    }).then(function (instance) {
        token = instance;
        return SirinCrowdsale.deployed();
    }).then(function (instance) {
        sale = instance;
        return RefundVault.deployed();
    }).then(function (instance) {
        vault = instance;
        return token.transferOwnership(sale.address);
    }).then(function () {
        return vault.transferOwnership(sale.address);
    }).then(function () {
        return sale.claimRefundVaultOwnership();
    }).then(function () {
        return sale.claimTokenOwnership();
    }).then(function () {
        return sale.transferOwnership(MultiSig.address);
    }).then(function () {
        return MultiSig.deployed();
    }).then(function(instance){
        multiSig = instance;
        return multiSig.submitTransaction(sale.address, 0, 0x4e71e0c8);
    });
};
