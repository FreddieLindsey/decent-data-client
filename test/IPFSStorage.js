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
  const patient_3 = findAccount('patient_3')
  const patient_4 = findAccount('patient_4')
  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  const path = 'nyancat.gif'
  const hash = 'Qm061864a08ae30bbd5933cba4cfcf621d401591fd'

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

  describe('finding available paths', () => {

    xit('should give count of available paths', () => {

    })

  })

  describe('adding data to contract', () => {

    it('should be successful with write access', () => {
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
        assert.equal(value, path, { from: patient_1.address })
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

    it('should be successful if read access', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then(() => {
        return instance().giveRead(patient_2.address, path, { from: patient_1.address })
      })
      .then(() => {
        return instance().get(path, { from: patient_2.address })
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('should throw error if no read access', () => {
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

  describe('getting and setting permissions', () => {

    it('should allow owner write by default', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        // Should return true for any path
        return instance().canWrite(patient_1.address, path)
      })
      .then((value) => {
        assert.equal(value, true)
      })
    })

    it('should allow owner read by default', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        // Should return true for any path
        return instance().canRead(patient_1.address, path)
      })
      .then((value) => {
        assert.equal(value, true)
      })
    })

    it('should not allow write by default to anyone', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        // Should return true for any path
        return instance().canWrite(patient_4.address, path)
      })
      .then((value) => {
        assert.equal(value, false)
      })
    })

    it('should not allow read by default to anyone', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        // Should return true for any path
        return instance().canRead(patient_4.address, path)
      })
      .then((value) => {
        assert.equal(value, false)
      })
    })

    it('should allow giving an address write access to a path as owner', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return instance().canWrite(patient_2.address, path)
      })
      .then((value) => {
        assert.equal(value, false)
      })
      .then(() => {
        // Should return true for any path
        return instance().giveWrite(patient_2.address, path, { from: patient_1.address })
      })
      .then(() => {
        return instance().canWrite(patient_2.address, path)
      })
      .then((value) => {
        assert.equal(value, true)
      })
    })

    it('should allow giving an address read access from a path as owner', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return instance().canRead(patient_2.address, path)
      })
      .then((value) => {
        assert.equal(value, false)
      })
      .then(() => {
        // Should return true for any path
        return instance().giveRead(patient_2.address, path, { from: patient_1.address })
      })
      .then(() => {
        return instance().canRead(patient_2.address, path)
      })
      .then((value) => {
        assert.equal(value, true)
      })
    })

    it('should not allow giving an address write access to a path as anyone', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return instance().giveWrite(patient_2.address, path)
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

    it('should not allow giving an address read access from a path as anyone', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return instance().giveRead(patient_2.address, path)
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

  })

})
