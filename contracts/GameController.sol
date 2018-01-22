pragma solidity ^0.4.4;

contract GameController {

  address owner;

  struct Bet {
    address account;
    uint amount;
    string bet;           // 'heads' or 'tails'
  }

  struct Game {
    address game;         // game address
    uint startsAt;
    uint pool;            // total prize money in the pool
    string status;        // 'open', 'closed', 'upcoming'
    string result;        // 'heads' or 'tails'
    // [] of bets Bet { address, amount, bet}
    uint numBets;
    mapping (uint => Bet) bets;
  }

  uint numGames;
  mapping (uint => Game) games;

  // http://solidity.readthedocs.io/en/develop/types.html#structs

  // Create a new Game
  function newGame(address beneficiary, uint startsAt) public returns (uint gameID) {
      gameID = numGames++; // gameID is return variable
      // Creates new struct and saves in storage. We leave out the mapping type.
      games[gameID] = Game({
        game: beneficiary,
        startsAt: startsAt,
        pool: 0,
        status: "open",
        result: "",
        numBets: 0
      });
  }

  // TODO
  // TODO
  // TODO
  // Work out how we can get the users bet of "heads" or "tails"
  // Force them to include it in their description ?
  function placeBet(uint gameID) public payable {
      Game storage g = games[gameID];
      // Creates a new temporary memory struct, initialised with the given values
      // and copies it over to storage.
      g.bets[g.numBets++] = Bet({addr: msg.sender, amount: msg.value, bet: msg.details });
      g.pool += msg.value;
  }

  function getOpenGames() public view returns (address[16]) {}

  function getUpcomingGames() public view returns (address[16]) {}

  function getClosedGames() public view returns (address[16]) {}

  // store the result of a game toss
  function gameToss() public {}

  // get the proof for a Game
  function gameProof(address game) public constant returns (string) {
    // todo
  }

  // returns true if toss is stored on the chain
  // *read-only function*
  function hasFinished(bytes32 proof) constant returns (bool) {
    for (uint256 i = 0; i < games.length; i++) {
      if (games[i].result == proof) {
        return true;
      }
    }
    return false;
  }
}