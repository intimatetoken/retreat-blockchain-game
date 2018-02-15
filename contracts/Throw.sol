pragma solidity 0.4.19;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Throw is Destructible {
  using SafeMath for uint;

  event HeaderBet(address indexed from, uint idx, uint value);
  event MatchedBet(address indexed header, address indexed tailer, uint idx);
  event Thrown(Status status);

  enum Status { NotThrown, Heads, Tails }

  struct Header {
    address owner;
    uint amount;
  }

  struct Bet {
    address heads;
    address tails;
    uint amount;
  }

  /**
   * Holds an array of matched bets.
   */
  Bet[] public bets;

  /**
   * Holds an array of open header bets. Bets are deleted
   * from this array when a bet is matched.
   */
  Header[] public headers;

  /**
   * Minimum time for the throw to take place.
   */
  uint public throwTime;

  /**
   * Holds current status of the throw
   */
  Status public status = Status.NotThrown;

  /**
   * Commission in percent to transfer to the owner.
   * Can be set changed via setCommission
   */
  uint public commission = 10;

  /**
   * Maps winnings
   */
  mapping(address => uint) public balances;

  modifier notThrown() {
    require(status == Status.NotThrown);
    _;
  }

  modifier thrown() {
    require(status == Status.Heads || status == Status.Tails);
    _;
  }

  modifier beforeThrow() {
    require(throwTime > now);
    _;
  }

  modifier afterThrow() {
    require(throwTime <= now);
    _;
  }

  /*****
   * @dev Create the contract
   * @param _throwTime   uint When a throw will take place (timestamp)
   */
  function Throw(uint _throwTime) public {
    require(_throwTime > now);

    throwTime = _throwTime;
  }

  function headEmUp() public payable notThrown beforeThrow {
    headers.push(Header({
      owner: msg.sender,
      amount: msg.value
    }));

    HeaderBet(msg.sender, headers.length - 1, msg.value);
  }

  // Fallback function makes a heads bet
  function () external payable {
    headEmUp();
  }

  function illTakeYa(uint idx) public payable notThrown beforeThrow {
    bets.push(Bet({
      heads: headers[idx].owner,
      tails: msg.sender,
      amount: msg.value
    }));

    delete headers[idx];

    MatchedBet(headers[idx].owner, msg.sender, idx);
  }

  function throwIt() public notThrown afterThrow {
    if (getRandom(10) % 2 == 1) {
      status = Status.Heads;
    } else {
      status = Status.Tails;
    }

    uint take = 0;

    for (uint i = 0; i < bets.length; ++i) {
      uint winnings = bets[i].amount.mul(2);
      uint fee = commission.mul(winnings).div(100);

      take = take.add(fee);
      winnings = winnings.sub(fee);

      if (status == Status.Heads) {
        balances[bets[i].heads] = winnings;
      } else {
        balances[bets[i].tails] = winnings;
      }
    }

    // Transfer
    Thrown(status);
    owner.transfer(fee);
  }

  function getRandom(uint max) internal constant returns (uint randomNumber) {
    return (uint(keccak256(block.blockhash(block.number - 1))) % max) + 1;
  }

  function claim() public {
    uint amount = balances[msg.sender];

    balances[msg.sender] = 0;

    msg.sender.transfer(amount);
  }

  function updateCommission(uint256 _commission) public notThrown {
    require(_commission > 0);

    commission = _commission;
  }

}
