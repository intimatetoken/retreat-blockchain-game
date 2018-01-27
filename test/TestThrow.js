var Throw = artifacts.require('./Throw.sol')

contract('Throw', accounts => {

  it('should have been deployed', async () => {
    let flip = await Throw.deployed()
    console.log(`Throw Deployed at ${flip.address}`)

    console.log('The current time is ', (await flip.getNow.call()).valueOf())
  });

});
