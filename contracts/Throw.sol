pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';

contract Throw is Destructible {

  struct HeadEm {
    address owner;
    uint amount;
  }

  struct Bet {
    address tails;
    address heads;
    uint amount;
  }

  Bet[] bets;
  HeadEm[] headEmUps;

  function getNow () public constant returns (uint time) {
    return now;
  }

  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public constant returns (uint) {
    return storedData;
  }

}
