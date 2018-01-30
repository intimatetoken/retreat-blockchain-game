pragma solidity 0.4.18;

import './Throw.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Spinner is Ownable {

  event Tossed(address where);

  function spin() public {
    Throw toss = new Throw();
    toss.transferOwnership(msg.sender);

    Tossed(address(toss));
  }
}
