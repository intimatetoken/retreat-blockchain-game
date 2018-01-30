pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Throw is Destructible {
  using SafeMath for uint;

  event Log(string msg, uint value);

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

  Bet[] public bets;
  Header[] public headers;
  uint public throwTime;
  Status public status = Status.NotThrown;
  uint public commission = 10;
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
    owner.transfer(fee);
  }

  // function getHeaders() returns (uint256[]) {
  //     return idsForContract[_contractAddress];
  // }

  function getRandom(uint max) internal constant returns (uint randomNumber) {
    return (uint(keccak256(block.blockhash(block.number - 1))) % max) + 1;
  }

  function withdraw() public thrown {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;
    msg.sender.transfer(amount);
  }

  function getHeadersCount() public constant returns (uint256) {
    return headers.length;
  }
  function getThrowTime() public constant returns (uint) {
    return throwTime;
  }

  function getBetsCount() public constant returns (uint256) {
    return bets.length;
  }

  function updateCommission(uint256 _commission) public notThrown {
      require(_commission > 0);

      commission = _commission;
  }

}
