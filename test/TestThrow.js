const util = require('./util')
const mapper = require('./mapper')

const moment = require('moment')
const chai = require('chai')
chai.use(require('chai-bignumber')())
const expect = chai.expect

const Throw = artifacts.require('./Throw.sol')
const TestHelper = artifacts.require('./TestHelper.sol')

contract('Throw', accounts => {

  let flip, helper

  let owner = accounts[0]
  let header = accounts[1]
  let tailer = accounts[2]
  let winner

  before(async () => {
    flip = await Throw.deployed()
    helper = await TestHelper.deployed()
  })

  it('should have been deployed', async () => {
    console.log(`Throw Deployed at ${flip.address}`)
    console.log('The current time is ', moment.unix(await helper.getNow.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
  });

  it('can set a bet on heads', async () => {
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

  it('can throw', async () => {
    // Arrange.
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

  it('winner can take their winnings', async () => {
    // Act.
    let { diff, txn } = await util.diffAfterTransaction(winner, () => flip.withdraw({ from: winner }))

    // Assert.
    expect(web3.fromWei(diff)).to.be.bignumber.equal(18)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(0)
  })

});
