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

  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  describe('getting storage contract', () => {

    it('should throw when a user has not registered', () => {
      const { contract, instance } = RegistryBlank()
      return contract
      .then(() => {
        return instance().get()
      })
      .catch((err) => {
        assert(isThrow(err))
      })
    })

    it('should be successful when a user has registed', () => {
      const { contract, instance } = RegistryBlank()
      const storage = IPFSStorageWithPublicKey(patient_1.address, publicKeyHash, true)
      return contract
      .then(() => {
        return storage.contract
      })
      .then(() => {
        return instance().register(storage.instance().address, { from: patient_1.address })
      })
      .then(() => {
        return instance().get({ from: patient_1.address })
      })
      .then((value) => {
        assert.equal(value, storage.instance().address)
      })
    })

  })

})
