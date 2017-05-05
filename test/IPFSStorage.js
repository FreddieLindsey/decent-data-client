import HashByte from '../utils/HashByte'
import { isThrow } from './utils'

let contracts = {}
const contractWithPublicKey = (account, publicKeyHash) => {
  if (!contracts[account]) {
    let i
    contracts[account] = {
      contract: IPFSStorage.new({ from: account }).then((instance) => {
        i = instance
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      }),
      instance: () => i
    }
  }

  return contracts[account]
}

const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('IPFSStorage', (accounts) => {

  const account = accounts[0]
  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  describe('contract initialisation', () => {

    it('should have a size of 0', () => {
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    it('should give two zero hashes for any path', () => {
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().get('random')
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), '')
        assert.equal(HashByte.toHash(value[0]), '')
      })
    })

  })

  describe('setting a public key', () => {

    it('should allow setting a public key', () => {
      contractWithPublicKey(account, publicKeyHash)
    })

    it('should only allow setting a public key once', () => {
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

    it('should not allow setting a public key if you\'re not the owner', () => {
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().updatePublicKey(
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
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: account }
        )
      })
      .then((value) => {
        return instance().get(path)
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('should allow getting the content back', () => {
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: account }
        )
      })
      .then((value) => {
        return instance().get(path)
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('index should be able to be used to get a path', () => {
      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: account }
        )
      })
      .then(() => {
        return instance().getIndex(0)
      })
      .then((value) => {
        assert.equal(value.valueOf(), path)
      })
    })

    it('should increment size on contract', () => {
      let s0

      const { contract, instance } = contractWithPublicKey(account, publicKeyHash)
      return contract
      .then(() => {
        return instance().size()
      })
      .then((value) => {
        s0 = value
        return instance().add(path, hash.slice(0, 32), hash.slice(32, 64), { from: account })
      })
      .then(() => {
        return instance().size()
      })
      .then((value) => {
        assert.equal(s0.plus(1).valueOf(), value.valueOf())
      })
    })

  })

})
