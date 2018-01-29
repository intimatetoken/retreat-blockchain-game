pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Throw is Destructible {
  using SafeMath for uint256;

  enum Status { NotThrown, Heads, Tails }

  struct Header {
    address owner;
    uint256 amount;
  }

  struct Bet {
    address heads;
    address tails;
    uint amount;
  }

  Bet[] public bets;
  Header[] public headers;
  Status public status;
  uint256 public commission = 10;

  function headEmUp() public payable {
    headers.push(Header({
      owner: msg.sender,
      amount: msg.value
    }));
  }

  function illTakeYa(uint256 idx) public payable {
    bets.push(Bet({
      heads: headers[idx].owner,
      tails: msg.sender,
      amount: msg.value
    }));
  }

  function throwIt() public {
    if (getRandom(10) % 2 == 1) {
      status = Status.Heads;
    } else {
      status = Status.Tails;
    }

    // let fee =
    owner.transfer(2000000000000000000);
  }

  // function getHeaders() returns (uint256[]) {
  //     return idsForContract[_contractAddress];
  // }

  function getRandom(uint max) internal constant returns (uint randomNumber) {
    return (uint(keccak256(block.blockhash(block.number - 1))) % max) + 1;
  }

  function getHeadersCount() public constant returns (uint256) {
    return headers.length;
  }

  function updateCommission(uint256 _commission) public {
      require(_commission > 0);

      commission = _commission;
  }

}
