pragma solidity 0.4.19;

import './Throw.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Spinner is Ownable {

  event Tossed(address where, uint when);

  function spin(uint when) public {
    Throw toss = new Throw(when);

    toss.transferOwnership(msg.sender);

    Tossed(address(toss), when);
  }
}
