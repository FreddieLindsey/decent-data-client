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

  address authority;

  /* addr => 0: not a member, 1: member, 2: struck off */
  mapping (address => uint) members;
  address[] members_addresses;

  function Group() {
    authority = msg.sender;
  }

  function getAuthority() constant returns (address) {
    return authority;
  }

  function member(address addr) constant returns (bool) {
    return members[addr] == 1;
  }

  function register(address addr) onlyOwner notBanned(addr) {
    members_addresses.push(addr);
    members[addr] = 1;
  }

  function remove(address addr) onlyOwner notBanned(addr) {
    members[addr] = 0;
  }

  function invalidate(address addr) onlyOwner {
    members[addr] = 2;
  }

  function getMembers() onlyOwner constant returns (address[]) {
    return members_addresses;
  }

}
