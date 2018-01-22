pragma solidity ^0.4.4;

contract GameController {

  address owner;

  struct Bet {
    address account;
    uint amount;
    string bet;           // 'heads' or 'tails'
    uint timestamp;
  }

  enum GameStatus {Open, Closed, Upcoming}

  struct Game {
    address ringer;           // person, running the game
    address contractAddress;    // Contract where the game exists
    string result;              // 'heads' or 'tails'
    uint expiryBlock;           // The block number this game will expire on

    GameStatus status;

    uint pool;            // total prize money in the pool

    Bet[] bets;
  }

  Game[] public games; // All games

  // http://solidity.readthedocs.io/en/develop/types.html#structs
  // https://github.com/dob/auctionhouse/blob/master/contracts/AuctionHouse.sol

  modifier onlyOpen(uint gameID) {
    Game storage g = games[gameID];
    if (g.status != GameStatus.Open) {
      throw;
    }
    // Game should not be over
    if (block.number >= g.expiryBlock) {
      throw;
    }
    _;
  }

  // modifier onlyOwner {
  //   if (owner != msg.sender) throw;
  //   _;
  // }


  // Events
  event GameCreated(uint gameID);
  event BidsClosed();
  event GameStarted();

  event LogFailure(string message);


  // Create new Game, then activate the game
  function newGame(
                  address beneficiary,
                  uint _deadline,   // in blocknumber
                  uint startsAt) public returns (uint gameID) {
    // Creates a new game
    gameID = games.length++;
    Game storage g = games[gameID];
    g.game = beneficiary;
    g.pool = 0;
    g.status = GameStatus.Upcoming;
    g.numBets = 0;

    // Check to see if the game is being created from a trusted party

    // Check to see if the game deadline is in the future
    if (block.number >= _deadline) {
      LogFailure("Block number is not in the future");
      throw;
    }

    GameCreated(gameID);

    return gameID;
  }

  // TODO
  // TODO
  // TODO
  // Work out how we can get the users bet of "heads" or "tails"
  // Force them to include it in their description ?
  function placeBet(uint gameID) public payable onlyOpen(gameID) returns (bool success) {
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