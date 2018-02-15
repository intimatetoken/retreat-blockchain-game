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



function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'))
}

/**
 * expect the callback to thow a "revert" exception
 */
function expectRevert (callback) {
  return callback()
    .then(() => {
      assert.fail('should have reverted')
    })
    .catch(err => {
      assert(err.toString().includes('revert'), err.toString())
    })
}

contract('Throw', accounts => {
  // contract instances
  let flip, blockHelper

  let owner = accounts[0]
  let header = accounts[1]
  let tailer = accounts[2]
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

  it('should have been deployed', async () => {
    console.log(`Throw Deployed at ${flip.address}`)
    console.log('The current time is ', moment.unix(await blockHelper.getNow.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
    console.log('Coins will be tossed at ', moment.unix(await flip.throwTime.call()).format("dddd, MMMM Do YYYY, h:mm:ss a"))
  });

  it('can place a bet on heads', async () => {
    // Act.
    let txn = await flip.headEmUp({ from: header, value: web3.toWei(10) })
    console.log(txn.logs)

    // Assert.
    let maker = mapper.toHeader(await flip.headers.call(0))

    expect(maker.owner).to.equal(header)
    expect(web3.fromWei(maker.amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  })

  it.skip('should return index of header bet', async () => {})
  it.skip('matched bet amount should match', async () => {})

  it('can match a bet with tails', async () => {
    // Act.
    let txn = await flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) })
    console.log(txn.logs)

    // Assert.
    let bet = mapper.toBet(await flip.bets.call(0))

    expect(bet.header).to.equal(header)
    expect(bet.tailer).to.equal(tailer)
    expect(web3.fromWei(bet.amount)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(20)
    expect(await util.getEthBalance(tailer)).to.be.bignumber.lessThan(90)
  })

  it.skip('Cannot throw before throw time', async () => {})

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
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(18)
  })

  it('after throw has a valid status', async () => {
    let validStates = ['Heads', 'Tails']
    let status = mapper.toStatus(await flip.status.call())
    expect(validStates.indexOf(status)).to.be.greaterThan(-1);
  })

  // exceptions
  it.skip('should not be able to make a bet once coins have been tossed', async () => {
    assert.fail('should have reverted')
  })
  it.skip('should not be able to match a bet once coins have been tossed', async () => {
    assert.fail('should have reverted')
  })

  it.skip('should not be able to make a bet after throwTime', async () => {
    assert.fail('should have reverted')
  })
  it.skip('should not be able to match a bet after throwTime', async () => {
    assert.fail('should have reverted')
  })

  it('should not be able to match the same (heads) bet twice', async () => {
    let txn = await flip.illTakeYa(0, { from: tailer, value: web3.toWei(10) })
      .then(() => {
        assert.fail('should have reverted')
      })
      .catch(err => {
        assert(err.toString().includes('revert'), err.toString())
      })
  })

  // Claiming
  it('Winners can claim() their winnings', async () => {
    // Act.
    let { diff, txn } = await util.diffAfterTransaction(winner, () => flip.claim({ from: winner }))

    // Assert.
    expect(web3.fromWei(diff)).to.be.bignumber.equal(18)
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(0)
  })

  it.skip('ONLY winners can claim their winnings', async () => {})
  it.skip('boxer (comission) is paid correctly', async () => {})
  it.skip('unclaimed winnings are refunded after 24hrs', async () => {})
  it.skip('owner can add gas to the contract', async () => {})


});
