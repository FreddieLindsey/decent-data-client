pragma solidity ^0.4.8;

import './IPFSStorage.sol';

contract Registry {

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  struct Register {
    bool      init;
    address[] items;
    address   own;
  }

  mapping (address => Register) contracts;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function register() {
    if (contracts[msg.sender].init)
      throw;

    contracts[msg.sender].init = true;
    contracts[msg.sender].own = new IPFSStorage();
  }

  function get() constant returns (address) {
    return mine();
  }

  function allowAccess(address someone) {
    insert(contracts[someone], mine());
  }

  function removeAccess(address someone) {
    remove(contracts[someone], mine());
  }

  function sizeShared() constant returns (uint) {
    return size(contracts[msg.sender]);
  }

  function getIndex(uint index) constant returns (address) {
    Register my_register = contracts[msg.sender];

    if (index < 0 || index >= size(my_register))
      throw;

    return my_register.items[index];
  }

  /* ----------------------------------------------------------------------- */
  /* SET LOGIC */
  /* ----------------------------------------------------------------------- */

  function insert(Register storage set, address c) internal {
    if (contains(set, c) == size(set))
      set.items.push(c);
  }

  function remove(Register storage set, address c) internal {
    if (contains(set, c) != size(set)) {
      set.items[contains(set, c)] = set.items[size(set) - 1];
      delete set.items[size(set) - 1];
    }
  }

  function contains(Register storage set, address c) internal returns (uint) {
    for (uint i = 0; i < size(set); i++)
      if (set.items[i] == c)
        return i;
    return size(set);
  }

  function size(Register storage set) internal returns (uint) {
    return set.items.length;
  }

  /* ----------------------------------------------------------------------- */
  /* UTILS */
  /* ----------------------------------------------------------------------- */

  function mine() internal returns (address) {
    return contracts[msg.sender].own;
  }

}
