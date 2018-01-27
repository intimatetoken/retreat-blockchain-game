var Throw = artifacts.require('./Throw.sol')

contract('Throw', accounts => {

  let flip

  before(async () => {
    flip = await Throw.deployed()
  })

  it('should have been deployed', async () => {
    console.log(`Throw Deployed at ${flip.address}`)

    console.log('The current time is ', (await flip.getNow.call()).valueOf())
  });

  it('can set and get a variable', async () => {
    let txn = await flip.set(5)

    console.log('Set to ', (await flip.get.call()).valueOf())
  });

});
