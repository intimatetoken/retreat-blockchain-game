const util = require('./util')
const mapper = require('./mapper')

const moment = require('moment')
const chai = require('chai')
chai.use(require('chai-bignumber')())
const expect = chai.expect

const Throw = artifacts.require('./Throw.sol')
const Spinner = artifacts.require('./Spinner.sol')
const TestHelper = artifacts.require('./TestHelper.sol')

const expectThrow = require('./helpers/expectThrow')


function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'))
}


contract('Throw', accounts => {

  let flip, helper

  //
  const MIN_BET_SIZE = ether(0.01)

  let owner = accounts[0]
  let header = accounts[1]
  let tailer = accounts[2]
  let throwTime
  let winner

  before(async () => {
    throwTime = moment().add(1, 'hour')
    let spinner = await Spinner.deployed()
    let txn = await spinner.spin(throwTime.unix())

    flip = await Throw.at(txn.logs[1].args.where)
    helper = await TestHelper.deployed()
  })

  it('should have been deployed', async () => {
    console.log(`Throw Deployed at ${flip.address}`)
    console.log('The current time is ', moment.unix(await helper.getNow.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
  });

  // it('cannot place a bet before', async () => {
  //   // Act.
  //   let txn = await flip.headEmUp({ from: header, value: web3.toWei(10) })

  //   // Assert.
  //   let maker = mapper.toHeader(await flip.headers.call(0))

  //   expect(maker.owner).to.equal(header)
  //   expect(web3.fromWei(maker.amount)).to.be.bignumber.equal(10)
  //   expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
  //   expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  // })

  it('can place a bet on heads', async () => {
    // Act.
    let txn = await flip.headEmUp({ from: header, value: web3.toWei(10) })

    // Assert.
    let maker = mapper.toHeader(await flip.headers.call(0))

    expect(maker.owner).to.equal(header)
    expect(web3.fromWei(maker.amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  })

  it('can match a bet with tails', async () => {
    // Act.
    let txn = await flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) })

    // Assert.
    let bet = mapper.toBet(await flip.bets.call(0))

    expect(bet.header).to.equal(header)
    expect(bet.tailer).to.equal(tailer)
    expect(web3.fromWei(bet.amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(20)
    expect(await util.getEthBalance(tailer)).to.be.bignumber.lessThan(90)
  })

  it('{n} bets should be 1', async () => {
    let betCount = await flip.getBetsCount()
    expect(betCount).to.be.bignumber.equal(1)
  })

  it('unnatched bets are refunded', async () => {})

  it('can throw', async () => {
    // Arrange.
    await util.setTime(helper, throwTime)
    await flip.updateCommission(10)

    // Act.
    let { diff, txn } = await util.diffAfterTransaction(owner, flip.throwIt)

    // Assert.
    let result = mapper.toStatus(await flip.status.call())
    winner = 'Heads' === result ? header : tailer

    expect(web3.fromWei(diff)).to.be.bignumber.equal(2) // 10% of 20 ETH
    expect(web3.fromWei(await flip.balances.call(winner))).to.be.bignumber.equal(18)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(18)
  })

  // exceptions
  it('should not be able to make a bet once coin has flipped', async () => {
    await expectThrow(flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) }));
  })

  it('should not be able to make a bet once throw has been made', async () => {
    await expectThrow(flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) }));
  })

  it('should not be able to match a bet twice', async () => {
    await expectThrow(flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) }));
  })

  it('winner can take their winnings', async () => {
    // Act.
    let { diff, txn } = await util.diffAfterTransaction(winner, () => flip.withdraw({ from: winner }))

    // Assert.
    expect(web3.fromWei(diff)).to.be.bignumber.equal(18)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(0)
  })

  it('winnings are distributed correctly', async () => {})


});
