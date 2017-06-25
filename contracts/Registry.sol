pragma solidity ^0.4.8;

import './IPFSStorage.sol';
import './Group.sol';

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
  mapping (address => address[]) groups;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function addStore(address store) notInitialised {
    if (IPFSStorage(store).getOwner() != msg.sender) throw;
    register[msg.sender] = store;
  }

  function addGroup(address group) {
    if (Group(group).getAuthority() != msg.sender) throw;
    groups[msg.sender].push(group);
  }

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS (CONSTANT) */
  /* ----------------------------------------------------------------------- */

  function getStore(address person) initialised(person) constant returns (address) {
    return register[person];
  }

  function getGroups() constant returns (address[]) {
    return groups[msg.sender];
  }

}
