pragma solidity 0.4.19;

import './Throw.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Spinner is Ownable {

  event Tossed(address where);

  function spin(uint throwTime) public {
    Throw toss = new Throw(throwTime);

    toss.transferOwnership(msg.sender);

    Tossed(address(toss));
  }
}
