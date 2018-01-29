const bluebird = require('bluebird')
const moment = require('moment')

web3.increaseTime = function (seconds, callback = () => {}) {
  web3.currentProvider.sendAsync({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [seconds],
    id: new Date().getTime()
  }, callback)
}

exports.setTime = async function (_dateTime) {
  let dateTime = moment.isMoment(_dateTime) ? _dateTime : moment(_dateTime)
  let currentTime = moment.unix(await helper.getNow.call())

  let diff = (dateTime - currentTime) / 1000

  if ( diff < 0 ) throw new Error('Impossible to go back in time with the chain')

  web3.increaseTime(diff)
  await helper.noop() // force mine a block to set the time
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

  return web3.fromWei(wei, 'ether').toNumber()
}
