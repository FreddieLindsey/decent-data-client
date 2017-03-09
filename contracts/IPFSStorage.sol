pragma solidity ^0.4.8;

contract IPFSStorage {
  bytes[] public storedData;

  event Error(string message);

  function IPFSStorage() {}

  function add(bytes hash) {
    storedData[storedData.length] = hash;
  }

  function get(uint index) constant returns (bytes retVal) {
    if (index < 0 || index >= storedData.length) {
      /* Undecided whether to throw an error or not */
      /*Error('Index not found');
      throw;*/
      return;
    }
    return storedData[index];
  }

  function size() constant returns (uint retVal) {
    return storedData.length;
  }

}
