pragma solidity ^0.4.8;

contract Group {

  /* ----------------------------------------------------------------------- */
  /* MODIFIER */
  /* ----------------------------------------------------------------------- */

  modifier onlyOwner() {
    if (msg.sender != authority) throw;
    _;
  }

  modifier notBanned(address addr) {
    if (members[addr] > 1) throw;
    _;
  }

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  address public authority;

  /* addr => 0: not a member, 1: member, 2: struck off */
  mapping (address => uint) members;

  function Group() {
    authority = msg.sender;
  }

  function member(address addr) constant returns (bool) {
    return members[addr] == 1;
  }

  function register(address addr) onlyOwner notBanned(addr) {
    members[addr] = 1;
  }

  function remove(address addr) onlyOwner notBanned(addr) {
    members[addr] = 0;
  }

  function invalidate(address addr) onlyOwner {
    members[addr] = 2;
  }

}
