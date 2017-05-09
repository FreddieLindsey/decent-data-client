pragma solidity ^0.4.8;

import './IPFSStorage.sol';

// Assume Registry deployed by some authority
contract Registry {

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  struct Register {
    bool      init;
    address   store;
  }

  mapping (address => Register) contracts;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function register(bytes32 pub_1, bytes32 pub_2) {
    if (contracts[msg.sender].init) throw;

    contracts[msg.sender].init = true;
    contracts[msg.sender].store = new IPFSStorage(msg.sender, pub_1, pub_2);
  }

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS (CONSTANT) */
  /* ----------------------------------------------------------------------- */

  function get() constant returns (address) {
    return get(msg.sender);
  }

  function get(address person) constant returns (address) {
    Register storage r = contracts[person];
    if (!r.init) throw;
    return r.store;
  }

}
