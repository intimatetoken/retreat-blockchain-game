const util = require('./helpers/util')
const mapper = require('./helpers/mapper')
const expectThrow = require('./helpers/expectThrow')

const moment = require('moment')
const chai = require('chai')
chai.use(require('chai-bignumber')())
const expect = chai.expect

const Toss = artifacts.require('./Throw.sol')
const Spinner = artifacts.require('./Spinner.sol')
const TestBlockHelper = artifacts.require('./TestHelper.sol')

function etherToWei (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'))
}

contract('TestSpinnerThrows', accounts => {
  // contract instances
  let blockHelper, spinner, toss

  const fixture = {
    throwTime: moment(),
    owner: accounts[0],
    heads: [
      {
        address: accounts[1],
        amount: etherToWei(0.5)
      },
      {
        address: accounts[2],
        amount: etherToWei(1)
      },
      {
        address: accounts[3],
        amount: etherToWei(1.5)
      },
      {
        address: accounts[4],
        amount: etherToWei(2)
      }
    ],
    tails: [
      {
        address: accounts[5],
        amount: etherToWei(0.5)
      },
      {
        address: accounts[6],
        amount: etherToWei(1)
      },
      {
        address: accounts[7],
        amount: etherToWei(1.5)
      },
      {
        address: accounts[8],
        amount: etherToWei(2)
      }
    ],
    matchedBets: 4, // fixture.heads.length
    refundedBets: 2, // (fixture.heads.length - fixture.matched)
    winnings: etherToWei(3),
    comissionPercentage: 10,
    boxerTake: etherToWei(0.3)
  }

  before(async () => {
    let {getInitialBalances, setupToss, placeMatchedBets} = util
    blockHelper = await TestBlockHelper.deployed()
    spinner = await Spinner.deployed()

    // heads
    for (let index = 0; index < fixture.heads.length; index++) {
      fixture.heads[index].intialBalance = await util.getEthBalance(fixture.heads[index].address)
    }
    // tails
    for (let index = 0; index < fixture.tails.length; index++) {
      fixture.tails[index].intialBalance = await util.getEthBalance(fixture.tails[index].address)
    }

    // owner
    fixture.ownerIntialBalance = await util.getEthBalance(fixture.owner)

    // console.log(JSON.stringify(fixture, null, 2))

    toss = await setupToss(spinner, fixture)
    toss = await placeMatchedBets(toss, fixture)
  })

  it('number of matched bets is correct', async () => {
    let betCount = await toss.getBetsCount()
    expect(betCount).to.be.bignumber.equal(fixture.matchedBets)
  })

  it('winner balances are correct', async () => {
    // ffwd to throw time
    await util.setTime(blockHelper, fixture.throwTime.add(20, 'minutes'))

    // toss it
    await toss.throwIt()
    let result = mapper.toStatus(await toss.status.call())

    console.log('result: ', result)

    for (let index = 0; index < fixture.matchedBets; index++) {
      let winner
      if (result === 'Heads') {
        winner = fixture.heads[index]
      } else if (result === 'Tails') {
        winner = fixture.tails[index]
      }

      let currentBalance = await util.getEthBalance(winner.address)
      let winnings = web3.fromWei(winner.amount * 2)
      let expectedBalance = parseInt(winner.intialBalance) + parseInt(winnings)

      // todo fees etc
      console.log(`Expected [${result}:${index}]`, JSON.stringify({
        initial: winner.intialBalance,
        bet: web3.fromWei(winner.amount),
        expectedBalance: expectedBalance,
        actual: currentBalance
      }, null, 2))

      // expect(currentBalance).to.be.bignumber.greaterThan(expectedBalance)
    }
  })


});
