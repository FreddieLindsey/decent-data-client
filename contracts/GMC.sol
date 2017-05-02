pragma solidity ^0.4.8;

contract GMC {

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  address authority;

  /* addr => 0: not a doctor, 1: doctor, 2: struck off */
  mapping (address => uint) doctors;

  function GMC() {
    authority = msg.sender;
  }

  function isDoctor(address addr) constant returns (bool) {
    return doctors[addr] == 1;
  }

  function registerDoctor(address addr) {
    if (doctors[addr] > 1)
      throw;

    doctors[addr] = 1;
  }

  function invalidate(address addr) {
    doctors[addr] = 2;
  }

}
