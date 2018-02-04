const bluebird = require('bluebird')
const moment = require('moment')

const Toss = artifacts.require('./Throw.sol')

/**
 * @param {Contract\Instance} Spinner A deployed instance of Spinner.sol
 * @param {json} fixtures
 *
 * @return {Contract\Instance} Throw
 */
module.exports.setupToss = async (spinner, fixture) => {
  let throwTime = fixture.throwTime
  // setup throw
  throwTime.add(15, 'minutes')
  console.log('Setting thowTime to : ', throwTime.format("dddd, MMMM Do YYYY, h:mm:ss a"))
  let txn = await spinner.spin(throwTime.unix())
  // address of the toss contract
  let toss = await Toss.at(txn.logs[1].args.where)
  console.log(`Toss is deployed at : ${toss.address}`)
  return toss
}

// place all matched bets
module.exports.placeMatchedBets = async (toss, fixture) => {
  for (let index = 0; index < fixture.matchedBets; index++) {
    console.log(`[${index}:heads] ${fixture.heads[index].amount}`)
    await toss.headEmUp({
      from: fixture.heads[index].address,
      value: fixture.heads[index].amount
    })
    console.log(`[${index}:tails] ${fixture.tails[index].amount}`)
    await toss.illTakeYa(index, {
      from: fixture.tails[index].address,
      value: fixture.tails[index].amount
    })
  }

  return toss
}

exports.increaseTime = async function (seconds) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [seconds],
      id: Date.now()
    }, (err, res) => err ? reject(err) : resolve(res))
  })
}

exports.setTime = async function (helper, _dateTime) {
  let dateTime = moment.isMoment(_dateTime) ? _dateTime : moment(_dateTime)
  let currentTime = moment.unix(await helper.getNow.call())

  let diff = dateTime.diff(currentTime, 'seconds');

  if ( diff < 0 ) throw new Error('Impossible to go back in time with the chain')

  await exports.increaseTime(diff)
  await helper.noop()
}

exports.getBalance = async function (addr) {
  return bluebird.promisify(web3.eth.getBalance)(addr)
}

exports.getGasPrice = async function () {
  return bluebird.promisify(web3.eth.getGasPrice)()
}

exports.getTransaction = async function (txn) {
  return bluebird.promisify(web3.eth.getTransaction)(txn)
}

exports.getEthBalance = async function (addr) {
  let wei = await bluebird.promisify(web3.eth.getBalance)(addr)
  return web3.fromWei(wei).toNumber()
}

/**
 * Executes a callback and returns the difference of the
 * address's balance in wei
 *
 * @param {*} address
 * @param {*} callback
 */
exports.diffAfterTransaction = async function(address, callback) {
  let start = await exports.getBalance(address)

  let txn = await callback()

  let gas = txn.receipt.gasUsed
  let gasPrice = (await exports.getTransaction(txn.tx)).gasPrice
  let fee = gasPrice.mul(gas)

  let after = await exports.getBalance(address)
  let diff = after.sub(start).add(fee)

  return { diff, txn }
}
