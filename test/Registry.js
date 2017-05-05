const Registry = artifacts.require('./Registry.sol')
const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('Registry', (accounts) => {

  const account = accounts[0]
  let account_IPFS

  describe('contract initialisation', () => {

    xit('should have a size of 0 when not registered', () => {
      return Registry.deployed()
      .then((instance) => {
        return instance.sizeShared()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    xit('should have a size of 0 when first registered', () => {
      let i
      return Registry.deployed()
      .then((instance) => {
        i = instance
        return i.register()
      })
      .then(() => {
        return i.sizeShared()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

  })

  describe('getting storage contract', () => {

    xit('should return valid IPFSStorage contract address', () => {
      let IPFS;
      return Registry.deployed()
      .then((instance) => {
        return instance.get()
      })
      .then((value) => {
        IPFS = IPFSStorage.at(value)
        account_IPFS = IPFS
        return IPFS.size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

  })

  describe('sharing the storage contract', () => {

    xit('should allow someone access', () => {
      let i, s
      return Registry.deployed()
      .then((instance) => {
        i = instance
        return i.sizeShared({ from: accounts[1] })
      })
      .then((value) => {
        s = value
        return i.allowAccess(accounts[1])
      })
      .then(() => {
        return i.sizeShared({ from: accounts[1] })
      })
      .then((value) => {
        assert.equal(value.valueOf(), s.plus(1).valueOf())
      })
    })

    xit('should remove someones access', () => {
      let i, s
      return Registry.deployed()
      .then((instance) => {
        i = instance
        return i.sizeShared({ from: accounts[1] })
      })
      .then((value) => {
        s = value
        return i.removeAccess(accounts[1])
      })
      .then(() => {
        return i.sizeShared({ from: accounts[1] })
      })
      .then((value) => {
        assert.equal(value.valueOf(), s.minus(1).valueOf())
      })
    })

    xit('should give the storage contract shared', () => {
      let i, s
      return Registry.deployed()
      .then((instance) => {
        i = instance
        return i.allowAccess(accounts[1])
      })
      .then(() => {
        return i.sizeShared({ from: accounts[1] })
      })
      .then((value) => {
        return i.getIndex(0, { from: accounts[1] })
      })
      .then((addr) => {
        assert.equal(addr, account_IPFS.address)
      })
    })

  })

})
