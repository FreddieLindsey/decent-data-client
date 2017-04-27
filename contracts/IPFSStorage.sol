pragma solidity ^0.4.8;

contract IPFSStorage {

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  struct Set {
    string[] items;
  }

  struct IpfsHash {
    bytes32 part1;
    bytes32 part2;
    mapping(address => uint) access_control;
  }

  /* Used for indexing */
  Set paths;

  /* Specific user's available paths */
  mapping (address => Set) user_paths;

  /* Record location */
  mapping (string => IpfsHash) hashes;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  /* ONLY ACCESSIBLE BY ENTITIES ABLE TO PROXY-RE-ENCRYPT / DATA OWNER */
  function add(string path, bytes32 hash1, bytes32 hash2) {
    /* Find the index of the path */
    uint index = contains(paths, path);

    /* If already available, check permissions */
    if (index != size(paths) && !allowedWrite(msg.sender, path))
      throw;

    /* Update path */
    insert(paths, path);
    insert(user_paths[msg.sender], path);
    hashes[path] = IpfsHash({
      part1: hash1,
      part2: hash2
    });

    /* TODO: discuss permissions for new data */
    allowWrite(msg.sender, path);
    allowRead(msg.sender, path);
  }

  /* ONLY ACCESSIBLE BY ENTITIES ABLE TO PROXY-RE-ENCRYPT / DATA OWNER */
  function get(string path) constant returns (bytes32, bytes32) {
    /* Find the index of the path */
    uint index = contains(paths, path);

    /* If already available, check permissions */
    if (index < size(paths) && !allowedRead(msg.sender, path))
      throw;

    /* Return hash of path */
    IpfsHash h = hashes[path];
    return (h.part1, h.part2);
  }

  /* ACCESSIBLE BY ANY PARTY */
  function getIndex(uint index) constant returns (string) {
    /* Get the user's available paths */
    Set my_paths = user_paths[msg.sender];

    /* Check index is valid and return blank if not */
    if (index < 0 || index >= size(my_paths))
      return "";

    /* Return blank for invalid */
    return my_paths.items[index];
  }

  /* ACCESSIBLE BY ANY PARTY */
  function size() constant returns (uint) {
    /* The size of the user's available paths */
    return size(paths);
  }

  /* ----------------------------------------------------------------------- */
  /* SET LOGIC */
  /* ----------------------------------------------------------------------- */

  function insert(Set storage set, string path) internal {
    if (contains(set, path) == size(set))
      set.items.push(path);
  }

  function contains(Set storage set, string path) internal returns (uint) {
    for (uint i = 0; i < size(set); i++)
      if (stringEqual(set.items[i], path))
        return i;
    return size(set);
  }

  function size(Set storage set) internal returns (uint) {
    return set.items.length;
  }

   /* ----------------------------------------------------------------------- */
  /* ACCESS CONTROL */
  /*
     No access by default (0)
     R = 1, W = 2, RL = 4, WL = 8
     mapping(uint => mapping(address => uint)) access_control

      1: R            2: W            3: R, W            4: RL
      5: R, RL        6: W, RL        7: R, W, RL        8: WL
      9: R, WL       10: W, WL       11: R, W, WL       12: RL, WL
     13: R, RL, WL   14: W, RL, WL   15: R, W, RL, WL
  */
  /* ----------------------------------------------------------------------- */

  /* VIEW ACCESS */

  function allowedVisible(address addr, string path) internal returns (bool) {
    IpfsHash h = hashes[path];
    uint access = h.access_control[addr];
    return (access != 0);
  }

  function allowedRead(address addr, string path) internal returns (bool) {
    IpfsHash h = hashes[path];
    uint access = h.access_control[addr];
    access = access % 2;
    return (access == 1);
  }

  function allowedWrite(address addr, string path) internal returns (bool) {
    IpfsHash h = hashes[path];
    uint access = h.access_control[addr];
    access = access % 4;
    return (access >= 2);
  }

  function allowedReadLog(address addr, string path) internal returns (bool) {
    IpfsHash h = hashes[path];
    uint access = h.access_control[addr];
    access = access % 8;
    return (access >= 4);
  }

  function allowedWriteLog(address addr, string path) internal returns (bool) {
    IpfsHash h = hashes[path];
    uint access = h.access_control[addr];
    /*access = access % 16;*/
    return (access >= 8);
  }

  /* ADD ACCESS */

  function allowRead(address addr, string path) internal {
    if (!allowedRead(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] += 1;
    }
  }

  function allowWrite(address addr, string path) internal {
    if (!allowedWrite(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] += 2;
    }
  }

  function allowReadLog(address addr, string path) internal {
    if (!allowedReadLog(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] += 4;
    }
  }

  function allowWriteLog(address addr, string path) internal {
    if (!allowedWriteLog(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] += 8;
    }
  }

  /* REMOVE ACCESS */

  function removeRead(address addr, string path) internal {
    if (allowedRead(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] -= 1;
    }
  }

  function removeWrite(address addr, string path) internal {
    if (allowedWrite(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] -= 2;
    }
  }

  function removeReadLog(address addr, string path) internal {
    if (allowedReadLog(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] -= 4;
    }
  }

  function removeWriteLog(address addr, string path) internal {
    if (allowedWriteLog(addr, path)) {
      IpfsHash h = hashes[path];
      h.access_control[addr] -= 8;
    }
  }

  /* ----------------------------------------------------------------------- */
  /* UTILS */
  /* ----------------------------------------------------------------------- */

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
