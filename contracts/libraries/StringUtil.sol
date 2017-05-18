pragma solidity ^0.4.8;

library StringUtil {

  function stringSlice(string s, uint start, uint end) returns (string) {
    bytes memory sBytes = bytes(s);
    bytes memory out = new bytes(end - start);
    for (uint i = 0; i < end; i++) {
      out[i] = sBytes[start + i];
    }
    return string(out);
  }

  function stringFindSeparator(string s, byte separator) returns (bool[]) {
    bool[] memory out;
    bytes memory sBytes = bytes(s);

    uint left = 0;
    for (uint i = 0; i < sBytes.length; i++) {
      if (sBytes[i] == separator) {
        out[i] = true;
        left = i + 1;
      }
    }
    return out;
  }

  function stringEqual(string a, string b) returns (bool) {
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
