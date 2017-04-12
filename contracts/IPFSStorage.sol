pragma solidity ^0.4.8;

contract IPFSStorage {

  struct IPFSHash {
    address submitter;
    bytes32 valuePart1;
    bytes32 valuePart2;
  }

  uint storedData;
  mapping (string => IPFSHash) IpfsContents;

  function add(string path, bytes32 hash1, bytes32 hash2) {
    /*IpfsContents[path] = IPFSHash(msg.sender, hash1, hash2);*/
    storedData++;
  }

  function get(string path) constant returns (bytes32 hash1, bytes32 hash2) {
    IPFSHash h = IpfsContents[path];
    return (h.valuePart1, h.valuePart2);
  }

  function size() constant returns (uint size) {
    return storedData;
  }

}
