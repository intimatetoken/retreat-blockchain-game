pragma solidity 0.4.18;

contract TestHelper {

    function getNow () public constant returns (uint time) {
        return now;
    }

    function noop () external pure { }

}
