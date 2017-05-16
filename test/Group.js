import {
  RegistryBlank,
  IPFSStorageWithPublicKey,

  accounts,
  isThrow
} from './utils'

const Group = artifacts.require('./Group.sol')
const IPFSStorage = artifacts.require('./IPFSStorage.sol')

contract('Group', () => {

  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  // Setup
  RegistryBlank(true)

  describe('registering a group', () => {

    xit('should', () => {

    })

  })

})
