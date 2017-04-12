const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('IPFSStorage', (accounts) => {

  const account = accounts[0]
  const empty = '0x'.concat(new Uint8Array(64).join(''))

  describe("contract initialisation", () => {

    it("should have a size of 0", () => {
      return IPFSStorage.deployed()
      .then((instance) => {
        return instance.size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    it("getting a path should return two zero hashes", () => {
      return IPFSStorage.deployed()
      .then((instance) => {
        return instance.get('random')
      })
      .then((value) => {
        assert.equal(value[0], empty)
        assert.equal(value[0], empty)
      })
    })

  })

})
