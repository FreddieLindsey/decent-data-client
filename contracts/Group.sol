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

  struct IpfsHash {
    bytes32 part1;
    bytes32 part2;
  }

  address authority;

  /* addr => 0: not a member, 1: member, 2: struck off */
  mapping (address => uint) members;
  address[] members_addresses;

  /* re-encryption keys for private group key */
  IpfsHash master_key;
  IpfsHash public_key;
  mapping (address => IpfsHash) reencryption_key;

  /* ----------------------------------------------------------------------- */
  /* FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function Group() {
    authority = msg.sender;
  }

  function setPrivateKey(bytes32 part1, bytes32 part2) onlyOwner {
    master_key = IpfsHash(part1, part2);
  }

  function setPublicKey(bytes32 part1, bytes32 part2) onlyOwner {
    public_key = IpfsHash(part1, part2);
  }

  function getPrivateKey() constant returns (bytes32, bytes32) {
    return (master_key.part1, master_key.part2);
  }

  function getPublicKey() constant returns (bytes32, bytes32) {
    return (public_key.part1, public_key.part2);
  }

  function addReencryptionKey(address addr, bytes32 part1, bytes32 part2) onlyOwner {
    reencryption_key[addr] = IpfsHash(part1, part2);
  }

  function getReencryptionKey() constant returns (bytes32, bytes32) {
    IpfsHash key = reencryption_key[msg.sender];
    return (key.part1, key.part2);
  }

  function getAuthority() constant returns (address) {
    return authority;
  }

  function member(address addr) constant returns (bool) {
    return members[addr] == 1;
  }

  function register(address addr) onlyOwner notBanned(addr) {
    members[addr] = 1;

    bool found = false;
    for (uint i = 0; i < members_addresses.length; i++)
      if (members_addresses[i] == addr) found = true;

    if (!found) members_addresses.push(addr);
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
