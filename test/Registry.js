import {
  RegistryBlank,
  IPFSStorageWithPublicKey,

  findAccount,
  isThrow
} from './utils'

const Registry = artifacts.require('./Registry.sol')
const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('Registry', (accounts) => {

  const patient_1 = findAccount('patient_1')
  const patient_2 = findAccount('patient_2')

  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  // Setup
  RegistryBlank(true)

  describe('registering a storage contract', () => {

    it('should be successful when a user has registered', () => {
      const { contract, instance } = RegistryBlank()
      const storage = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      let ipfs
      return contract
      .then(() => {
        return storage.contract
      })
      .then(() => {
        ipfs = storage.instance().address
        return instance().addStore(ipfs, { from: patient_1.address })
      })
    })

  })

  describe('getting storage contract', () => {

    it('should be successful when a user has registered', () => {
      const { contract, instance } = RegistryBlank()
      const storage = IPFSStorageWithPublicKey(patient_1.address)
      let ipfs
      return contract
      .then(() => storage.contract)
      .then(() => {
        ipfs = storage.instance().address
        return instance().getStore(patient_1.address, { from: patient_1.address })
      })
      .then((value) => {
        assert.equal(value, ipfs)
      })
    })

    it('should throw when a user has not registered', () => {
      const { contract, instance } = RegistryBlank()
      return contract
      .then(() => {
        return instance().getStore(patient_2.address)
      })
      .catch((err) => {
        assert(isThrow(err))
      })
    })

  })

})
