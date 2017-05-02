pragma solidity ^0.4.8;

contract GMC {

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  struct Doctor {
    bool doctor;
    bool valid;
  }

  address authority;
  mapping (address => Doctor) doctors;

  function GMC() {
    authority = msg.sender;
  }

  function isDoctor(address addr) constant returns (bool) {
    return doctors[addr].doctor;
  }

  function isValid(address addr) constant returns (bool) {
    return doctors[addr].doctor && doctors[addr].valid;
  }

  function invalidate(address addr) {
    doctors[addr].valid = false;
  }

}
