const SafeMath = artifacts.require('./math/SafeMath.sol');
const Ownable = artifacts.require('./ownership/Ownable.sol');
const MvuToken = artifacts.require("./token/MvuToken.sol");
const MvuTokenBet = artifacts.require("./MvuTokenBet.sol");
const MvuSale = artifacts.require("./crowdsale/Crowdsale.sol");

const BigNumber = require('bignumber.js');

module.exports = (deployer, network, accounts) => {
    //  let totalSupply, minimumGoal, minimumContribution, maximumContribution, deployAddress, start, hours, isPresale, discounts;
    let deployAddress = accounts[0];    
    let totalSupply = 50;

    deployer.deploy(SafeMath, {from: deployAddress});
    deployer.deploy(Ownable, {from: deployAddress});
    deployer.link(Ownable, [MvuToken, MvuSale], {from: deployAddress});
    deployer.link(SafeMath, [MvuToken, MvuSale], {from: deployAddress});   
    deployer.deploy(MvuToken, totalSupply,  {from: deployAddress});   
};
