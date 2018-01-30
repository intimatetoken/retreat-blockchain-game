const util = require('./helpers/util')
const mapper = require('./helpers/mapper')
const expectThrow = require('./helpers/expectThrow')

const moment = require('moment')
const chai = require('chai')
chai.use(require('chai-bignumber')())
const expect = chai.expect

const Throw = artifacts.require('./Throw.sol')
const Spinner = artifacts.require('./Spinner.sol')
const TestBlockHelper = artifacts.require('./TestHelper.sol')



function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'))
}

const MIN_BET_SIZE = ether(0.01)
contract('Throw', accounts => {
  // contract instances
  let flip, blockHelper

  let owner = accounts[0]
  let header = accounts[1]
  let tailer = accounts[2]
  let throwTime
  let winner

  before(async () => {

    // Round up the spinner
    let spinner = await Spinner.deployed()
    // setup throw
    throwTime = moment().add(1, 'hour')
    let txn = await spinner.spin(throwTime.unix())
    flip = await Throw.at(txn.logs[1].args.where)

    blockHelper = await TestBlockHelper.deployed()
  })

  it('should have been deployed', async () => {
    console.log(`Throw Deployed at ${flip.address}`)
    console.log('The current time is ', moment.unix(await blockHelper.getNow.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
    console.log('Coins will be tossed at ', moment.unix(await flip.getThrowTime.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
  });

  // there needs to be min one bet in order for a toss to be made.


  it('cannot place a bet before', async () => {
    // Act.
    let txn = await flip.headEmUp({ from: header, value: web3.toWei(10) })

    // Assert.
    let maker = mapper.toHeader(await flip.headers.call(0))

    expect(maker.owner).to.equal(header)
    expect(web3.fromWei(maker.amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  })

  // it('can place a bet on heads', async () => {
  //   // Act.
  //   let txn = await flip.headEmUp({ from: header, value: web3.toWei(10) })

  //   // Assert.
  //   let maker = mapper.toHeader(await flip.headers.call(0))

  //   expect(maker.owner).to.equal(header)
  //   expect(web3.fromWei(maker.amount)).to.be.bignumber.equal(10)
  //   expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
  //   expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  // })

  // it('can match a bet with tails', async () => {
  //   // Act.
  //   let txn = await flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) })

  //   // Assert.
  //   let bet = mapper.toBet(await flip.bets.call(0))

  //   expect(bet.header).to.equal(header)
  //   expect(bet.tailer).to.equal(tailer)
  //   expect(web3.fromWei(bet.amount)).to.be.bignumber.equal(10)
  //   expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(20)
  //   expect(await util.getEthBalance(tailer)).to.be.bignumber.lessThan(90)
  // })

  // it('{n} bets should be 1', async () => {
  //   let betCount = await flip.getBetsCount()
  //   expect(betCount).to.be.bignumber.equal(1)
  // })

  // it('unnatched bets are refunded', async () => {})

  // it('can throw', async () => {
  //   // Arrange.
  //   await util.setTime(blockHelper, throwTime)
  //   await flip.updateCommission(10)

  //   // Act.
  //   let { diff, txn } = await util.diffAfterTransaction(owner, flip.throwIt)

  //   // Assert.
  //   let result = mapper.toStatus(await flip.status.call())
  //   winner = 'Heads' === result ? header : tailer

  //   expect(web3.fromWei(diff)).to.be.bignumber.equal(2) // 10% of 20 ETH
  //   expect(web3.fromWei(await flip.balances.call(winner))).to.be.bignumber.equal(18)
  //   expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(18)
  // })

  // it('throw is in a valid status', async () => {
  //   let validStates = ['Heads', 'Tails']
  //   let status = mapper.toStatus(await flip.status.call())
  //   expect(validStates.indexOf(status)).to.be.greaterThan(-1);
  // })

  // // exceptions
  // it('should not be able to make a bet once coins have been tossed', async () => {
  //   await flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) })
  //     .catch(err => {
  //       assert(err.toString().includes('revert'), err.toString())
  //     })
  // })

  // // it('should not be able to match a bet twice', async () => {
  // //   await expectThrow(flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) }));
  // // })

  // // it('winner can take their winnings', async () => {
  // //   // Act.
  // //   let { diff, txn } = await util.diffAfterTransaction(winner, () => flip.withdraw({ from: winner }))

  // //   // Assert.
  // //   expect(web3.fromWei(diff)).to.be.bignumber.equal(18)
  // //   expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(0)
  // // })

  // it('winnings are distributed correctly', async () => {})
  // // ie. we have enough gas/wei
  // it('winnings can be claimed', async () => {
  //   // Act.
  //   let { diff, txn } = await util.diffAfterTransaction(winner, () => flip.withdraw({ from: winner }))

  //   // Assert.
  //   expect(web3.fromWei(diff)).to.be.bignumber.equal(18)
  //   expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(0)
  // })

  // it('winnings are distributed correctly', async () => {})


});
