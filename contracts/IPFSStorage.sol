pragma solidity ^0.4.8;

import "./Group.sol";

/*
  CORE PRINCIPLES:

    - All paths lead to some hash (null or not null)
    - Data layer
      - Allows setting the hash of a path
      - Allows getting the hash of a path
    - Verification layer
      - Cannot submit data unless a public key has been set
    - Security layer
      - Owner can read, write to any path
      - Can only write to a path which you have been granted access to write to
      - Can only read from a path which you have been granted access to read from
*/
contract IPFSStorage {

  /* ----------------------------------------------------------------------- */
  /* MODIFIERS */
  /* ----------------------------------------------------------------------- */

  modifier onlyOwner() {
    if (msg.sender != owner) throw;
    _;
  }

  modifier ownerAdd(string path) {
    if (msg.sender == owner) {
      insert(user_paths[owner], path);
    }
    _;
  }

  modifier writable(string path) {
    if (msg.sender != owner && !allowedWrite(msg.sender, path)) throw;
    _;
  }

  modifier readable(string path) {
    if (msg.sender != owner && !allowedRead(msg.sender, path)) throw;
    _;
  }

  modifier groupMember(string name) {
    if (!Group(groups[name]).member(msg.sender)) throw;
    _;
  }

  /* ----------------------------------------------------------------------- */
  /* DATA STRUCTURES */
  /* ----------------------------------------------------------------------- */

  struct Set {
    string[] items;
  }

  struct SetShare {
    Share[] shares;
  }

  struct IpfsHash {
    bytes32 part1;
    bytes32 part2;
    mapping(address => uint) access_control;
  }

  struct Share {
    address identity;
    bool group;
    uint permissions;
  }

  /* Contract owner */
  address owner;

  /* Public key to encrypt data */
  IpfsHash publicKey;

  /* Specific user's available paths */
  mapping (address => Set) user_paths;

  /* Re-encryption key hashes */
  mapping (address => IpfsHash) reencryption_keys;

  /* Who has access to a path */
  mapping (string => SetShare) shares;

  /* Record location */
  mapping (string => IpfsHash) hashes;

  /* Groups */
  mapping (string => address) groups;
  string[] group_names;

  /* ----------------------------------------------------------------------- */
  /* EXTERNAL FUNCTIONS */
  /* ----------------------------------------------------------------------- */

  function IPFSStorage(bytes32 pub_1, bytes32 pub_2) {
    owner = msg.sender;
    publicKey = IpfsHash(pub_1, pub_2);
  }

  function addReencryptionKey(address reader, bytes32 hash1, bytes32 hash2) onlyOwner {
    /* Add key to mapping */
    reencryption_keys[reader] = IpfsHash(hash1, hash2);
  }

  /* ONLY ACCESSIBLE BY PERSONS WHO CAN WRITE TO THE PATH */
  function add(string path, bytes32 hash1, bytes32 hash2) ownerAdd(path) writable(path) {
    /* Update path */
    hashes[path].part1 = hash1;
    hashes[path].part2 = hash2;
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function giveWrite(address writer, string path) onlyOwner {
    allowWrite(writer, path, false);
    insert(user_paths[owner], path);
    insert(user_paths[writer], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function giveWriteGroup(string name, string path) onlyOwner {
    address group = groups[name];
    if (group == 0) throw;

    allowWrite(group, path, true);
    insert(user_paths[owner], path);
    insert(user_paths[group], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function giveRead(address reader, string path) onlyOwner {
    allowRead(reader, path, false);
    insert(user_paths[owner], path);
    insert(user_paths[reader], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function giveReadGroup(string name, string path) onlyOwner {
    address group = groups[name];
    if (group == 0) throw;

    allowRead(group, path, true);
    insert(user_paths[owner], path);
    insert(user_paths[group], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function takeWrite(address writer, string path) onlyOwner {
    removeWrite(writer, path);
    remove(user_paths[writer], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function takeWriteGroup(string name, string path) onlyOwner {
    address group = groups[name];
    if (group == 0) throw;

    removeWrite(group, path);
    remove(user_paths[group], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function takeRead(address reader, string path) onlyOwner {
    removeRead(reader, path);
    remove(user_paths[reader], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function takeReadGroup(string name, string path) onlyOwner {
    address group = groups[name];
    if (group == 0) throw;

    removeRead(group, path);
    remove(user_paths[group], path);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function addGroup(address group, string name) onlyOwner {
    groups[name] = group;

    for (uint i = 0; i < group_names.length; i++)
      if (stringEqual(group_names[i], name))
        return;
    group_names.push(name);
  }

  /* ONLY ACCESSIBLE BY OWNER. REMOVE ALL GROUP ACCESS */
  function removeGroup(string name) onlyOwner {
    address group = groups[name];
    if (group == 0) throw;

    /* Remove group address */
    groups[name] = 0;

    /* Remove permissions on all paths */
    for (uint i = 0; i < size(user_paths[group]); i++)
      removeAll(group, user_paths[group].items[i]);

    /* Set number of items for address to none */
    user_paths[group] = Set(new string[](0));
  }

  /* CONSTANT FUNCTIONS */

  /* ACCESSIBLE BY ANY PARTY */
  function getOwner() constant returns (address) {
    return owner;
  }

  /* ACCESSIBLE BY ANY PARTY */
  function getPublicKey() constant returns (bytes32, bytes32) {
    return (publicKey.part1, publicKey.part2);
  }

  /* ONLY ACCESSIBLE BY PERSONS WHO CAN READ FROM THE PATH */
  function getReencryptionKey() constant returns (bytes32, bytes32) {
    IpfsHash key = reencryption_keys[msg.sender];
    return (key.part1, key.part2);
  }

  /* ONLY ACCESSIBLE BY PERSONS WHO CAN READ FROM THE PATH */
  function get(string path) readable(path) constant returns (bytes32, bytes32) {
    /* Return hash of path */
    IpfsHash h = hashes[path];
    return (h.part1, h.part2);
  }

  /* ONLY ACCESSIBLE BY PERSONS WHO CAN READ FROM THE PATH */
  function getGroup(string path, string name) groupMember(name) readable(path) constant returns (bytes32, bytes32) {
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
  function getIndexGroup(uint index, string name) groupMember(name) constant returns (string) {
    /* Get the user's available paths */
    Set my_paths = user_paths[groups[name]];

    /* Check index is valid and return blank if not */
    if (index < 0 || index >= size(my_paths))
      return "";

    /* Return blank for invalid */
    return my_paths.items[index];
  }

  /* ACCESSIBLE BY ANY PARTY */
  function size() constant returns (uint) {
    /* The size of the user's available paths */
    return size(user_paths[msg.sender]);
  }

  /* ACCESSIBLE BY ANY PARTY */
  function sizeGroup(string name) constant returns (uint) {
    Group group = Group(groups[name]);

    if (!group.member(msg.sender)) throw;

    /* The size of the user's available paths */
    return size(user_paths[groups[name]]);
  }

  /* ONLY ACCESSIBLE BY OWNER */
  function getIndexShare(string path, uint index) onlyOwner constant returns (address, uint, bool) {
    Share[] storage path_share = shares[path].shares;
    return (
      path_share[index].identity,
      path_share[index].permissions,
      path_share[index].group
    );
  }

  /* ONLY BY ACCESSIBLE BY OWNER */
  function sizeShare(string path) onlyOwner constant returns (uint) {
    SetShare storage path_share = shares[path];
    return path_share.shares.length;
  }

  /* ACCESSIBLE BY ANY PARTY */
  function canWrite(address writer, string path) constant returns (bool) {
    return writer == owner || allowedWrite(writer, path);
  }

  /* ACCESSIBLE BY ANY PARTY */
  function canWriteGroup(string name, address writer, string path) constant returns (bool) {
    Group group = Group(groups[name]);

    if (!group.member(writer)) throw;

    return allowedWrite(group, path);
  }

  /* ACCESSIBLE BY ANY PARTY */
  function canRead(address reader, string path) constant returns (bool) {
    return reader == owner || allowedRead(reader, path);
  }

  /* ACCESSIBLE BY ANY PARTY */
  function canReadGroup(string name, address reader, string path) constant returns (bool) {
    Group group = Group(groups[name]);

    if (!group.member(reader)) throw;

    return allowedRead(group, path);
  }

  function getGroupsSize() /* onlyOwner */ constant returns (uint) {
    return group_names.length;
  }

  function getGroup(uint index) /* onlyOwner */ constant returns (address, string) {
    string name = group_names[index];
    return (groups[name], name);
  }

  function getGroupAddress(string name) /* onlyOwner */ constant returns (address) {
    return groups[name];
  }

  /* ----------------------------------------------------------------------- */
  /* SET LOGIC */
  /* ----------------------------------------------------------------------- */

  function insert(Set storage set, string path) internal {
    if (contains(set, path) == size(set))
      set.items.push(path);
      /*set.items.length++;*/
  }

  function remove(Set storage set, string path) internal {
    uint index = contains(set, path);
    if (index != size(set)) {
      set.items[index] = set.items[size(set) - 1];
      set.items[size(set) - 1] = '';
      set.items.length--;
    }
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
  /* SET SHARE LOGIC */
  /* ----------------------------------------------------------------------- */

  function insert(SetShare storage set, address addr, bool group, uint permissions) internal {
    if (contains(set, addr) == size(set))
      set.shares.push(Share(addr, group, permissions));
    else
      set.shares[contains(set, addr)] = Share(addr, group, permissions);
  }

  function remove(SetShare storage set, address addr) internal {
    uint index = contains(set, addr);
    if (index != size(set)) {
      set.shares[index] = set.shares[size(set) - 1];
      set.shares[size(set) - 1] = Share(0, false, 0);
      set.shares.length--;
    }
  }

  function contains(SetShare storage set, address addr) internal returns (uint) {
    for (uint i = 0; i < size(set); i++)
      if (set.shares[i].identity == addr)
        return i;
    return size(set);
  }

  function size(SetShare storage set) internal returns (uint) {
    return set.shares.length;
  }

   /* ----------------------------------------------------------------------- */
  /* ACCESS CONTROL */
  /*
     No access by default (0)
     R = 1, W = 2
     mapping(uint => mapping(address => uint)) access_control

     0: _         1: R          2: W          3: R, W
  */
  /* ----------------------------------------------------------------------- */

  /* VIEW ACCESS */

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

  /* ADD ACCESS */

  function allowRead(address addr, string path, bool group) internal {
    if (!allowedRead(addr, path)) {
     IpfsHash h = hashes[path];
     h.access_control[addr] += 1;

     SetShare storage sharing = shares[path];
     insert(sharing, addr, group, h.access_control[addr]);
    }
  }

  function allowWrite(address addr, string path, bool group) internal {
    if (!allowedWrite(addr, path)) {
     IpfsHash h = hashes[path];
     h.access_control[addr] += 2;

     SetShare storage sharing = shares[path];
     insert(sharing, addr, group, h.access_control[addr]);
    }
  }

  /* REMOVE ACCESS */

  function removeAll(address addr, string path) internal {
    IpfsHash h = hashes[path];
    h.access_control[addr] = 0;
  }

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

  /* ----------------------------------------------------------------------- */
  /* STRING LOGIC */
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

  /* ----------------------------------------------------------------------- */
  /* UTILS */
  /* ----------------------------------------------------------------------- */

}
