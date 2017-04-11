pragma solidity ^0.4.8;

contract IPFSStorage {
  uint storedData;
  mapping (string => bytes) data;

  /*event Error(string message);*/

  function IPFSStorage() {}

  function add(string path, bytes hash) {
    data[path] = hash;
    storedData++;
  }

  function test() {
    storedData++;
  }

  function get(string path) constant returns (bytes retVal) {
    return data[path];
  }

  function size() constant returns (uint retVal) {
    return storedData;
  }

}
