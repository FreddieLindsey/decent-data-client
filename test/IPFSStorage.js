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

  // Setup
  IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)

  describe('contract initialisation', () => {

    it('should have a size of 0', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address)
      return contract
      .then(() => {
        return instance().size()
      })
      .then((value) => {
        assert.equal(value.valueOf(), 0)
      })
    })

    it('owner of contract should be public', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address)
      return contract
      .then(() => {
        return instance().getOwner()
      })
      .then((value) => {
        assert.equal(value, patient_1.address)
      })
    })

  })

  describe('finding available paths', () => {

    it('should give count of available paths (readable / writeable)', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return instance().add(
          path, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then(() => {
        return instance().giveRead(patient_2.address, path + '_read', { from: patient_1.address })
      })
      .then(() => {
        return instance().giveWrite(patient_2.address, path + '_write', { from: patient_1.address })
      })
      .then(() => {
        return instance().size({ from: patient_2.address })
      })
      .then((value) => {
        assert.equal(value.valueOf(), 2)
      })
    })

    it('should be able to use an index to get a path available to the user', () => {
      const { contract, instance } =
        IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      const path_ = path + Math.random().toString()
      return contract
      .then(() => {
        return instance().add(
          path_, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then(() => {
        return instance().getIndex(0, { from: patient_1.address })
      })
      .then((value) => {
        assert.equal(value, path_, { from: patient_1.address })
      })
    })

  })

  describe('adding data to contract', () => {

    it('should be successful if write access', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address)
      const path_ = path + Math.random().toString()
      return contract
      .then(() => {
        return instance().add(
          path_, hash.slice(0, 32), hash.slice(32, 64), { from: patient_1.address }
        )
      })
      .then(() => {
        return instance().get(path_, { from: patient_1.address })
      })
      .then((value) => {
        assert.equal(HashByte.toHash(value[0]), hash.slice(0, 32))
        assert.equal(HashByte.toHash(value[1]), hash.slice(32, 64))
      })
    })

    it('should throw error if no write access', () => {
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address)
      const path_ = path + Math.random().toString()
      return contract
      .then(() => {
        return instance().add(
          path_, hash.slice(0, 32), hash.slice(32, 64), { from: patient_2.address }
        )
      })
      .catch((err) => {
        assert.equal(isThrow(err), true)
      })
    })

    it('should increment size on contract', () => {
      let s0

      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address)
      return contract
      .then(() => {
        return instance().size({ from: patient_1.address })
      })
      .then((value) => {
        s0 = value
        return instance().add(
          Math.random().toString(), hash.slice(0, 32), hash.slice(32, 64),
          { from: patient_1.address }
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
      const { contract, instance } = IPFSStorageWithPublicKey(patient_1.address)
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

    it('should allow owner write', () => {
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

    it('should allow owner read', () => {
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
