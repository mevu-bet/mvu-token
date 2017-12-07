import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';
const MvuToken = artifacts.require("./token/MvuToken.sol");
const MvuTokenBet = artifacts.require("./MvuTokenBet.sol");
const assertRevert = require('./helpers/assertRevert.js');
const BigNumber = require('bignumber.js');
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))   
  .should();
   


contract('MvuToken', function(accounts) {
    let instance;
    let saleEnd;
    let endTime;
    let afterEndTime;
    let now = 1512669320;
    let bets;
    let betsEnd;
    let tokensPurchased = 100;
    let initialSupply = 50; 

    beforeEach('setup contract for each test', async function () {
        instance = await MvuToken.deployed();
        bets = MvuTokenBet.at(await instance.bet());           
        saleEnd = 1519022657;
        betsEnd = 1519000652;        
    })

    it ("should start with initial supply of MVU in first account", async function() {                 
        let balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), initialSupply, "50 wasn't in the first account");             
    });

    describe('before bets end', async function () {
      it('should accept bets', async function () {
        await instance.makeBet(accounts[0], 1, 100).should.be.fulfilled;
        await instance.makeBet(accounts[1], 2, 100).should.be.fulfilled;         
      });
      it('should reject win claims', async function () {    
          await instance.claimWin({from: accounts[0]}).should.be.rejectedWith(EVMRevert);         
      });
    });

    describe('after bets end', async function () {     
      it('should reject bets', async function () {
        await increaseTimeTo(betsEnd);        
        await instance.makeBet(accounts[0], 1, tokensPurchased).should.be.rejectedWith(EVMRevert);               
      });
      it ('should let the owner set the event winner', async function () {
        await instance.setEventWinner(1).should.be.fulfilled;
      });
      it ('should not let a non-owner set the event winner', async function () {
        await instance.setEventWinner(1, {from : accounts[1]}).should.be.rejectedWith(EVMRevert);
      });    
    });

    describe('before sale ends', async function () {
      it('should reject transfers', async function () {
        await instance.transfer(accounts[1], 10).should.be.rejectedWith(EVMRevert);         
      });
      it('should reject win claims', async function () {    
          await instance.claimWin({from: accounts[0]}).should.be.rejectedWith(EVMRevert);         
      });
    });

    describe('after sale ends', function () {             
        it('should accept winning win claims', async function () {
          await increaseTimeTo(saleEnd); 
          await instance.claimWin().should.be.fulfilled;         
        });
        it('should reject losing win claims', async function () {          
          await instance.claimWin({from:accounts[1]}).should.be.fulfilled;
          let balance = await instance.balanceOf(accounts[1]);
          assert.equal(balance.valueOf(), 0, "Win claim wrongly awarded");          
        });
        it('should reward ten percent of tokens purchased', async function () {
          let balance = await instance.balanceOf.call(accounts[0]);
          assert.equal(balance.valueOf(),(initialSupply+(tokensPurchased/10)), "Did not reward ten percent");   
        });
        it('should reject duplicate win claims', async function () {    
          await instance.claimWin({from: accounts[0]}).should.be.rejectedWith(EVMRevert);      
        });
        it('should accept transfers after sale ends', async function () {         
          await instance.transfer(accounts[1], 10).should.be.fulfilled;          
        });             
    });

    describe('minting and transferring tokens', function () {
        it('should reject minting tokens for non-owner', async function () {
            await instance.mint(accounts[0], 1, {from: accounts[1]}).should.be.rejectedWith(EVMRevert);         
        });     
        it('should mint tokens for owner', async function () {          
            await instance.mint(accounts[0], 1, {from: accounts[0]}).should.be.fulfilled;          
        });    
        it('should reject minting over cap', async function () {    
            await instance.mint(accounts[0], 10000000001, {from: accounts[0]}).should.be.rejectedWith(EVMRevert);         
        });          
        it('should reject transfers over balance', async function () {    
            await instance.transfer(accounts[1], 200).should.be.rejectedWith(EVMRevert);         
        });
    }); 
});