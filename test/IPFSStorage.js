import HashByte from '../utils/HashByte'

const IPFSStorage = artifacts.require('./IPFSStorage.sol')

const isThrow = (err) => {
  return err.toString().indexOf('invalid JUMP') !== -1
}

contract('IPFSStorage', (accounts) => {

  const account = accounts[0]
  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  describe('contract initialisation', () => {

    it('should have a size of 0', () => {
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        return instance.size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    it('should give two zero hashes for any path', () => {
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        return instance.get('random')
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), '')
        assert.equal(HashByte.toHash(value[0]), '')
      })
    })

  })

  describe('setting a public key', () => {

    it('should allow setting a public key', () => {
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
    })

    it('should only allow setting a public key once', () => {
      let i
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        i = instance
        return i.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
      .then(() => {
        return i.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

    it('should not allow setting a public key if you\'re not the owner', () => {
      let i
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: accounts[1] }
        )
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

  })

  describe('adding data to contract', () => {

    const path = 'nyancat.gif'
    const hash = 'Qm061864a08ae30bbd5933cba4cfcf621d401591fd'

    it('should be successful', () => {
      let i;
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        i = instance
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
      .then(() => {
        return i.add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: account }
        )
      })
      .then((value) => {
        return i.get(path)
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('should allow getting the content back', () => {
      let i;
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        i = instance
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
      .then(() => {
        return i.add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: account }
        )
      })
      .then((value) => {
        return i.get(path)
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('index should be able to be used to get a path', () => {
      let i;
      return IPFSStorage.new({ from: account })
      .then((instance) => {
        i = instance
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
      .then(() => {
        return i.add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: account }
        )
      })
      .then(() => {
        return i.getIndex(0)
      })
      .then((value) => {
        assert.equal(value.valueOf(), path)
      })
    })

    xit('should increment size on contract', () => {
      let i, s0;
      return IPFSStorage.deployed()
      .then((instance) => {
        i = instance
        return i.size()
      })
      .then((value) => {
        s0 = value
        return i.add(path, hash.slice(0, 32), hash.slice(32, 64), { from: account })
      })
      .then(() => {
        return i.size()
      })
      .then((value) => {
        assert.equal(s0.plus(1).valueOf(), value.valueOf())
      })
    })

  })

})
