pragma solidity ^0.4.8;

contract IPFSStorage {

  struct IpfsHash {
    address submitter;
    bytes32 part1;
    bytes32 part2;
  }

  uint storedData;
  mapping (string => IpfsHash) hashes;

  function IPFSStorage() {
    storedData = 0;
  }

  function add(
    string path,
    bytes32 hash1,
    bytes32 hash2
  ) {
    hashes[path] = IpfsHash({
      submitter: msg.sender,
      part1: hash1,
      part2: hash2
    });
    storedData = storedData + 1;
  }

  function get(string path) constant returns (
    bytes32,
    bytes32
  ) {
    IpfsHash h = hashes[path];
    return (
      h.part1,
      h.part2
    );
  }

  function size() constant returns (uint) {
    return storedData;
  }

}
