// const MvuTokenBet = artifacts.require("./MvuTokenBet.sol");
// import ether from './helpers/ether';
// import { advanceBlock } from './helpers/advanceToBlock';
// import { increaseTimeTo, duration } from './helpers/increaseTime';
// import latestTime from './helpers/latestTime';
// import EVMRevert from './helpers/EVMRevert';
// const assertRevert = require('./helpers/assertRevert.js');

// const BigNumber = require('bignumber.js');
// const should = require('chai')
//   .use(require('chai-as-promised'))
//   .use(require('chai-bignumber')(BigNumber))   
//   .should();


// contract('MvuTokenBet', function(accounts) {
//    let instance;


//    beforeEach('setup contract for each test', async function () {
//        instance = await MvuTokenBet.deployed();      
       
//    })

//    describe('making bets', function () {
//        it ("should let the owner make bets", async function() {                  
//            await instance.makeBet(accounts[0], 1, 1000).should.be.fulfilled;              
//        });
//        it ("should not let a non-owner make bets", async function() {       
//            await instance.makeBet(accounts[1], 1, 1000, {from: accounts[1]}).should.be.rejectedWith(EVMRevert); 
//        });
//    });

//    describe('settling bets', function () {
//     it ("should not let someone settle another persons bet", async function() {                  
//         await instance.settle(accounts[0], {from: accounts[1]}).should.be.rejectedWith(EVMRevert); 
//         let betSettled = await instance.checkSettled(accounts[0]);
//         betSettled.should.be.false;           
//     });
//         it ("should let the owner settle their bets", async function() {                  
//             await instance.settle(accounts[0]).should.be.fulfilled;
//             let betSettled = await instance.checkSettled(accounts[0]);
//             betSettled.should.be.true;           
//         });
   
//    });

//    describe('event winner function', function () {
//        it ("should let the owner set the event winner", async function() {
//             await instance.setEventWinner(1).should.be.fulfilled;
//        });
//        it ("should not let a non-owner set the event winner", async function() {
//             await instance.setEventWinner(1, {from: accounts[1]}).should.be.rejectedWith(EVMRevert); 
//        });
//    });
  

// });