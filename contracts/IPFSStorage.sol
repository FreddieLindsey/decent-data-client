pragma solidity ^0.4.8;

contract IPFSStorage {

  struct Set {
    string[] items;
  }

  struct IpfsHash {
    address submitter;
    bytes32 part1;
    bytes32 part2;
    mapping(address => uint) access_control;
  }

  Set paths;
  mapping (string => IpfsHash) hashes;

  function add(string path, bytes32 hash1, bytes32 hash2) {
    hashes[path] = IpfsHash({
      submitter: msg.sender,
      part1: hash1,
      part2: hash2
    });
  }

  function get(string path) constant returns (bytes32, bytes32) {
    IpfsHash h = hashes[path];
    return (h.part1, h.part2);
  }

  function getIndex(uint index) constant returns (string) {
    if (index < 0 || index >= paths.items.length)
      return paths.items[index];
    return "";
  }

  function size() constant returns (uint) {
    return paths.items.length;
  }

  function insert(string path) internal {
    for (uint i = 0; i < paths.items.length; i++) {
      if (stringEqual(paths.items[i], path)) {
        return;
      }
    }
    paths.items.push(path);
  }

  function stringEqual(string a, string b) internal returns (bool) {
    bytes memory _a = bytes(a);
    bytes memory _b = bytes(b);
    if (_a.length != _b.length)
			return false;
		for (uint i = 0; i < _a.length; i ++)
			if (_a[i] != _b[i])
				return false;
		return true;
  }

}
