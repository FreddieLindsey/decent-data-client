import HashByte from '../utils/HashByte'

const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('IPFSStorage', (accounts) => {

  const account = accounts[0]

  describe('contract initialisation', () => {

    it('should have a size of 0', () => {
      return IPFSStorage.deployed()
      .then((instance) => {
        return instance.size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    it('should give two zero hashes for any path', () => {
      return IPFSStorage.deployed()
      .then((instance) => {
        return instance.get('random')
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), '')
        assert.equal(HashByte.toHash(value[0]), '')
      })
    })

  })

  describe('adding data to contract', () => {

    const path = 'nyancat.gif'
    const hash = 'Qm061864a08ae30bbd5933cba4cfcf621d401591fd'

    it('should be successful', () => {
      let i;
      return IPFSStorage.deployed()
      .then((instance) => {
        i = instance
        return instance.add(
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

  })

})
