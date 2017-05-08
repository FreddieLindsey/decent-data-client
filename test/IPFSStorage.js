import HashByte from '../utils/HashByte'
import {
  IPFSStorageWithPublicKey,

  findAccount,
  isThrow
} from './utils'

const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('IPFSStorage', (accounts) => {

  const patient_1 = findAccount('patient_1')
  const patient_2 = findAccount('patient_2')
  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  describe('contract initialisation', () => {

    it('should have a size of 0', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    it('owner of contract should be public', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().owner()
      })
      .then((value) => {
        assert.equal(value, patient_1.address)
      })
    })

  })

  describe('setting a public key', () => {

    it('should allow setting a public key', () => {
      return IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
    })

    it('should only allow setting a public key once', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: patient_1.address }
        )
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

    it('should not allow setting a public key if you\'re not the owner', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: patient_2.address }
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
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then((value) => {
        return instance().get(path, { from: patient_1.address })
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('should allow getting the content back', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then((value) => {
        return instance().get(path, { from: patient_1.address })
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('index should be able to be used to get a path', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then(() => {
        return instance().getIndex(0, { from: patient_1.address })
      })
      .then((value) => {
        assert.equal(value.valueOf(), path, { from: patient_1.address })
      })
    })

    it('should increment size on contract', () => {
      let s0

      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().size({ from: patient_1.address })
      })
      .then((value) => {
        s0 = value
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then(() => {
        return instance().size({ from: patient_1.address })
      })
      .then((value) => {
        assert.equal(value.valueOf(), s0.plus(1).valueOf())
      })
    })

  })

  describe('getting data from a contract', () => {

    it('should throw error for any path when there is no data', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return instance().get('random')
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

  })

})
