pragma solidity ^0.4.8;

import './IPFSStorage.sol';

// Assume Registry deployed by some authority
contract Registry {

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  struct Register {
    bool        init;
    IPFSStorage store;
  }

  mapping (address => Register) contracts;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function register(IPFSStorage store) {
    if (contracts[msg.sender].init) throw;
    if (store.owner() != msg.sender) throw;

    contracts[msg.sender] = Register(true, store);
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
