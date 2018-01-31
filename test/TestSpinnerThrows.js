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

contract('TestSpinnerThrows', accounts => {
  // contract instances
  let blockHelper, spinner

  let owner = accounts[0]
  let header = accounts[1]
  let tailer = accounts[2]

  let throwTime = moment()
  let throwsCount = (24 * 60) / 15 // 1 throw every 15min for 24 hrs

  before(async () => {
    blockHelper = await TestBlockHelper.deployed()
    spinner = await Spinner.deployed()
  })

  // setup 96 games at 15min intervals
  for (let index = 0; index < throwsCount; index++) {

    it(`toss#${index} throwTime is correct`, async () => {
      // setup throw
      throwTime.add(15, 'minutes')
      console.log('Setting thowTime to : ', throwTime.format("dddd, MMMM Do YYYY, h:mm:ss a"))
      let txn = await spinner.spin(throwTime.unix())
      // address of the toss contract
      let toss = await Toss.at(txn.logs[1].args.where)
      console.log(`Toss is deployed at : ${toss.address}`)
    })

  }

  it(`Spinner reports the right number of tosses`, async () => {
    expect(await spinner.getThrowCount.call()).to.be.bignumber.equal(throwsCount)
  })

});
