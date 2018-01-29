const util = require('./util')
const mapper = require('./mapper')

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


  before(async () => {
    flip = await Throw.deployed()
    helper = await TestHelper.deployed()
  })

  it('should have been deployed', async () => {
    console.log(`Throw Deployed at ${flip.address}`)

    console.log('The current time is ', (await helper.getNow.call()).valueOf())
  });

  it('can set a bet on heads', async () => {
    // Act.
    let txn = await flip.headEmUp({ from: header, value: web3.toWei(10, 'ether') })

    // Assert.
    let maker = await flip.headers.call(0)

    expect(maker[0]).to.equal(header)
    expect(maker[1]).to.be.bignumber.equal(web3.toWei(10, 'ether'))
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(10)
    expect(await util.getEthBalance(header)).to.be.bignumber.lessThan(90)
  })

  it('can match a bet with tails', async () => {
    // Act.
    let txn = await flip.illTakeYa(0, { from: tailer, value: web3.toWei(10, 'ether') })

    // Assert.
    let bet = await flip.bets.call(0)

    console.log('bet', bet[2].toString())

    expect(bet[0]).to.equal(header)
    expect(bet[1]).to.equal(tailer)
    expect(bet[2]).to.be.bignumber.equal(web3.toWei(10, 'ether'))
    expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(20)
    expect(await util.getEthBalance(tailer)).to.be.bignumber.lessThan(90)
  })

  it('can throw', async () => {
    // Arrange.
    await flip.updateCommission(10)
    let start = await util.getBalance(owner)
    console.log('start', start.toString())

    // Act.
    let txn = await flip.throwIt()

    // Assert.
    let gas = txn.receipt.gasUsed
    let gasPrice = (await util.getTransaction(txn.tx)).gasPrice
    let fee = gasPrice.mul(gas)
    let after = await util.getBalance(owner)

    let diff = web3.fromWei(after.sub(start).add(fee)).toNumber()
    let result = mapper.toStatus(await flip.status.call())
    console.log('It was: ', result)
    console.log('Owner earnt: ', diff)

    expect(diff).to.equal(2) // 10% of 20 ETH

    // expect(bet[0]).to.equal(header)
    // expect(bet[1]).to.equal(tailer)
    // expect(bet[2]).to.be.bignumber.equal(web3.toWei(10, 'ether'))
    // expect(await util.getEthBalance(flip.address)).to.be.bignumber.equal(20)
    // expect(await util.getEthBalance(tailer)).to.be.bignumber.lessThan(90)
  })

});
