pragma solidity 0.4.19;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Throw is Destructible {
  using SafeMath for uint;

  event HeaderBet(address indexed from, uint value);
  event MatchedBet(address indexed header, address indexed tailer, uint value);
  event Thrown(Status status);

  enum Status { None, Heads, Tails }

  struct Bet {
    address heads;
    address tails;
    uint amount;
  }

  /**
   * Holds an array of matched bets.
   */
  Bet[] public book;

  /**
   * Minimum time for the throw to take place.
   */
  uint public throwTime;

  /**
   * Holds current status of the throw
   */
  Status public status = Status.None;

  /**
   * Commission in percent to transfer to the owner.
   * Can be set changed via setCommission
   */
  uint public commission = 10;

  /**
   * Maps winnings
   */
  mapping(address => uint) public winnings;

  /**
   * Maps addresses to open header bets. Bets are deleted
   * from this mapping when a bet is matched.
   */
  mapping(address => uint) public headers;

  /**
   * Maps addresses to open header bets. Bets are deleted
   * from this mapping when a bet is matched.
   */
  mapping(address => Status) public bets;

  modifier notThrown() {
    require(status == Status.None);
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

  modifier noHeaders() {
    require(headers[msg.sender] == 0);
    _;
  }

  modifier noBets() {
    for (uint i = 0; i < book.length; ++i) {
      require(book[i].tails != msg.sender);
      require(book[i].heads != msg.sender);
    }

    _;
  }

  modifier equalBet(address header) {
    require(headers[header] == msg.value);
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

  function headEmUp() public payable notThrown beforeThrow noHeaders noBets {
    headers[msg.sender] = msg.value;
    bets[msg.sender] = Status.Heads;

    HeaderBet(msg.sender, msg.value);
  }

  function illTakeYa(address header) public payable notThrown beforeThrow noHeaders equalBet(header) noBets {
    book.push(Bet({
      heads: header,
      tails: msg.sender,
      amount: msg.value
    }));

    bets[msg.sender] = Status.Tails;
    delete headers[header];

    MatchedBet(header, msg.sender, msg.value);
  }

  function throwIt() public notThrown afterThrow onlyOwner {
    if (getRandom(10) % 2 == 1) {
      status = Status.Heads;
    } else {
      status = Status.Tails;
    }

    uint take = 0;

    for (uint i = 0; i < book.length; ++i) {
      uint _winnings = book[i].amount.mul(2);
      uint fee = commission.mul(_winnings).div(100);

      take = take.add(fee);
      _winnings = _winnings.sub(fee);

      if (status == Status.Heads) {
        winnings[book[i].heads] = _winnings;
      } else {
        winnings[book[i].tails] = _winnings;
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
    uint amount = winnings[msg.sender];

    winnings[msg.sender] = 0;

    msg.sender.transfer(amount);
  }

  function giveMeMyMoneyBack() public {
    uint amount = headers[msg.sender];

    headers[msg.sender] = 0;

    msg.sender.transfer(amount);
  }

  function updateCommission(uint256 _commission) public notThrown {
    require(_commission > 0);

    commission = _commission;
  }

  // Fallback function makes a heads bet
  function () external payable {
    headEmUp();
  }

}
