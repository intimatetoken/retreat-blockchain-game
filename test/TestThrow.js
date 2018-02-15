const util = require('./helpers/util')
const mapper = require('../src/helpers/mapper')
const expectThrow = require('./helpers/expectThrow')

const moment = require('moment')
const chai = require('chai')
chai.use(require('chai-bignumber')())
const expect = chai.expect

const Throw = artifacts.require('./Throw.sol')
const Spinner = artifacts.require('./Spinner.sol')
const TestBlockHelper = artifacts.require('./TestHelper.sol')

contract('Throw', accounts => {
  // contract instances
  let flip, blockHelper

  let owner = accounts[0]
  let header = accounts[1]
  let tailer = accounts[2]
  let header2 = accounts[3]
  let throwTime
  let winner

  // Ensure contracts are all deployed
  before(async () => {
    blockHelper = await TestBlockHelper.deployed()
    let spinner = await Spinner.deployed()

    // setup throw
    throwTime = moment().add(1, 'hour')
    let txn = await spinner.spin(throwTime.unix())

    // address of the toss contract
    flip = await Throw.at(txn.logs[1].args.where)
  })

  // it('should have been deployed', async () => {
  //   console.log(`Throw Deployed at ${flip.address}`)
  //   console.log('The current time is ', moment.unix(await blockHelper.getNow.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
  //   console.log('Coins will be tossed at ', moment.unix(await flip.throwTime.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
  // });

  it('can place a bet on heads', async () => {
    // Act.
    let txn = await flip.headEmUp({ from: header, value: web3.toWei(10) })

    // Assert.
    let amount = await flip.headers.call(header)

    expect(web3.fromWei(amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  })

  it('can place another bet on heads that wont be matched', async () => {
    // Act.
    let txn = await flip.headEmUp({ from: header2, value: web3.toWei(5) })
  })

  it('can match a bet with tails', async () => {
    // Act.
    let txn = await flip.illTakeYa(header, { from: tailer, value: web3.toWei(10) })

    // Assert.
    let bet = mapper.toBet(await flip.bets.call(0))

    expect(bet.header).to.equal(header)
    expect(bet.tailer).to.equal(tailer)
    expect(web3.fromWei(bet.amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(25)
    expect(await util.getEthBalance(tailer)).to.be.bignumber.lessThan(90)
  })

  it('can throw after throw time', async () => {
    // Arrange.
    await util.setTime(blockHelper, throwTime)
    await flip.updateCommission(10)

    // Act.
    let { diff, txn } = await util.diffAfterTransaction(owner, flip.throwIt)

    // Assert.
    let result = mapper.toStatus(await flip.status.call())
    winner = 'Heads' === result ? header : tailer

    expect(web3.fromWei(diff)).to.be.bignumber.equal(2) // 10% of 20 ETH
    expect(web3.fromWei(await flip.balances.call(winner))).to.be.bignumber.equal(18)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(23)
  })

  it('after throw has a valid status', async () => {
    let validStates = ['Heads', 'Tails']
    let status = mapper.toStatus(await flip.status.call())
    expect(validStates.indexOf(status)).to.be.greaterThan(-1);
  })

  it('Winners can claim their winnings', async () => {
    // Act.
    let { diff, txn } = await util.diffAfterTransaction(winner, () => flip.claim({ from: winner }))

    // Assert.
    expect(web3.fromWei(diff)).to.be.bignumber.equal(18)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(5)
  })

  it('Unmatched bets can get their money back', async () => {
    // Act.
    let { diff, txn } = await util.diffAfterTransaction(header2, () => flip.giveMeMyMoneyBack({ from: header2 }))

    // Assert.
    expect(web3.fromWei(diff)).to.be.bignumber.equal(5)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(0)
  })

});
