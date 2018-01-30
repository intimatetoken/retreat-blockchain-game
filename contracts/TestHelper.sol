pragma solidity 0.4.18;

contract TestHelper {

  bool state = false;

  function getNow () public constant returns (uint time) {
      return now;
  }

  function noop () public {
    state = ! state;
  }

}
