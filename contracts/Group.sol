pragma solidity ^0.4.8;

contract Group {

  /* ----------------------------------------------------------------------- */
  /* MODIFIER */
  /* ----------------------------------------------------------------------- */

  modifier onlyOwner() {
    if (msg.sender != authority) throw;
    _;
  }

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  address authority;

  /* addr => 0: not a member, 1: member, 2: struck off */
  mapping (address => uint) members;

  function Group() {
    authority = msg.sender;
  }

  function member(address addr) constant returns (bool) {
    return members[addr] == 1;
  }

  function register(address addr) onlyOwner {
    if (members[addr] > 1)
      throw;

    members[addr] = 1;
  }

  function invalidate(address addr) onlyOwner {
    members[addr] = 2;
  }

}
