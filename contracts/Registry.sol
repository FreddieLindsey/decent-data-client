pragma solidity ^0.4.8;

import './IPFSStorage.sol';

// Assume Registry deployed by some authority
contract Registry {

  /* ----------------------------------------------------------------------- */
  /* MODIFIERS */
  /* ----------------------------------------------------------------------- */

  modifier notInitialised() {
    if (register[msg.sender] != 0) throw;
    _;
  }

  modifier initialised(address person) {
    if (register[person] == 0) throw;
    _;
  }

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  mapping (address => address) register;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function addStore(address store) notInitialised {
    if (IPFSStorage(store).getOwner() != msg.sender) throw;
    register[msg.sender] = store;
  }

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS (CONSTANT) */
  /* ----------------------------------------------------------------------- */

  function getStore(address person) initialised(person) constant returns (address) {
    return IPFSStorage(register[person]).getOwner();
  }

}
