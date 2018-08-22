const MevuCrowdsale = artifacts.require("../build/SirinCrowdsale.sol");
const MevuToken = artifacts.require("../build/SirinSmartToken.sol");


import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMThrow from './helpers/EVMThrow';

const assertRevert = require('./helpers/assertRevert.js');

const BigNumber = require('bignumber.js');
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();


contract('MevuCrowdsale', function (accounts) {
    let sale, token;

    const value = ether(1)

    let zeroAddress = '0x0000000000000000000000000000000000000000';
    let testGasPrice = 2000000000;


    before(async function () {

        this.startTime = latestTime();

        // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach('setup contract for each test', async function () {
        sale = await MevuCrowdsale.deployed();
        token = await MevuToken.deployed();

    });


    describe('Rate Mechanism', function () {
        it('Should be on day 10 - 808 ', async function () {
            await increaseTimeTo(this.startTime + duration.days(9));
            let rate = await sale.getRate.call()
            assert.equal(rate.valueOf(), 808);
        });
        it('Should be on day 11 - 797 ', async function () {
            await increaseTimeTo(this.startTime + duration.days(10));
            let rate = await sale.getRate.call()
            assert.equal(rate.valueOf(), 797);
        });
        it('Should be on day 29 - 632 ', async function () {
            await increaseTimeTo(this.startTime + duration.days(28));
            let rate = await sale.getRate.call()
            assert.equal(rate.valueOf(), 632);
        });
        it('Should be on day 30 - 625 ', async function () {
            await increaseTimeTo(this.startTime + duration.days(29));
            let rate = await sale.getRate.call()
            assert.equal(rate.valueOf(), 625);
        });
        it('Should be on day 31 - 625 ', async function () {
            await increaseTimeTo(this.startTime + duration.days(30));
            let rate = await sale.getRate.call()
            assert.equal(rate.valueOf(), 625);
        });
    });


    describe('adding to whitelist -- ', function () {
        it("should let owner add an address to whitelist", async function () {
            await sale.addToWhitelist(accounts[1], { from: accounts[0] }).should.be.fulfilled;
        });
        it("should prevent a non-owner from adding an address to whitelist", async function () {
            await sale.addToWhitelist(accounts[0], { from: accounts[1] }).should.be.rejectedWith(EVMThrow);
        });
        it("should let owner add many addresses to whitelist", async function () {
            await sale.addManyToWhitelist([accounts[2], accounts[3], accounts[4]], { from: accounts[0] }).should.be.fulfilled;
        });
        it("should prevent a non-owner from removing many addresses from whitelist", async function () {
            await sale.removeManyFromWhitelist([accounts[2], accounts[3], accounts[4]], { from: accounts[1] }).should.be.rejectedWith(EVMThrow);
        });
        it("should let owner remove many addresses from whitelist", async function () {
            await sale.removeManyFromWhitelist([accounts[2], accounts[3], accounts[4]], { from: accounts[0] }).should.be.fulfilled;
        });
        it("should prevent a non-owner from adding many addresses to whitelist", async function () {
            await sale.addManyToWhitelist([accounts[2], accounts[3], accounts[4]], { from: accounts[1] }).should.be.rejectedWith(EVMThrow);
        });

    });

    describe('Token destroy', function () {
        it('should not allow destroy before sale finalize', async function () {
            await sale.buyTokens(accounts[1], {
                value: ether(1),
                from: accounts[1]
            }).should.be.fulfilled;
            await token.destroy(accounts[1], 20, { from: accounts[1] }).should.be.rejectedWith(EVMThrow);
        });
        it('should allow destroy after sale finalize', async function () {
            await increaseTimeTo(this.startTime + duration.days(100));
            await sale.finalize().should.be.fulfilled;
            await token.destroy(accounts[1], 10, { from: accounts[1] }).should.be.fulfilled;
        });
    });

    describe('Adding to and subtracting from private allocation', function () {
        it('should allow owner to move tokens from public to private if available', async function () {
            let amountToMove = 1000000000000000000000000;
            let founderGrantBefore = await sale.founderGrant.call();
            let saleHardCapBefore = await sale.saleHardCap.call();
            await sale.addToPrivateAllocation(amountToMove).should.be.fulfilled;
            let founderGrantAfter = await sale.founderGrant.call();
            let saleHardCapAfter = await sale.saleHardCap.call();            
            founderGrantAfter.minus(founderGrantBefore).should.be.bignumber.equal(amountToMove);
            saleHardCapBefore.minus(saleHardCapAfter).should.be.bignumber.equal(amountToMove);
        });
        it('should allow owner to move tokens from private to public if available', async function () {
            let amountToMove = 1000000000000000000000000;
            let founderGrantBefore = await sale.founderGrant.call();
            let saleHardCapBefore = await sale.saleHardCap.call();
            await sale.addToPublicAllocation(amountToMove).should.be.fulfilled;
            let founderGrantAfter = await sale.founderGrant.call();
            let saleHardCapAfter = await sale.saleHardCap.call();            
            founderGrantBefore.minus(founderGrantAfter).should.be.bignumber.equal(amountToMove);
            saleHardCapAfter.minus(saleHardCapBefore).should.be.bignumber.equal(amountToMove);
        });
        it('should not allow a non-owner to move tokens', async function () {
            await sale.addToPrivateAllocation(100, {from: accounts[1]}).should.be.rejectedWith(EVMThrow);
            await sale.addToPublicAllocation(100, {from: accounts[1]}).should.be.rejectedWith(EVMThrow);

        });


    });

});