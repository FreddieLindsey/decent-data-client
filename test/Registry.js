import {
  Registry,
  Group,
  IPFSStorage,

  accounts
} from './utils'

import { isThrow } from '../utils'

contract('Registry', () => {

  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  // Setup
  Registry(true)

  describe('registering a storage contract', () => {

    it('should allow registering a user', () => {
      const { contract, instance } = Registry()
      const storage = IPFSStorage(accounts('patient_1').address, publicKeyHash, true)
      let ipfs
      return contract
      .then(() => {
        return storage.contract
      })
      .then(() => {
        ipfs = storage.instance().address
        return instance().addStore(ipfs, { from: accounts('patient_1').address })
      })
    })

  })

  describe('getting storage contract', () => {

    xit('should be successful when a user has registered', () => {
      const { contract, instance } = Registry()
      const storage = IPFSStorage(accounts('patient_1').address)
      let ipfs
      return contract
      .then(() => storage.contract)
      .then(() => {
        ipfs = storage.instance().address
        return instance().getStore(
          accounts('patient_1').address, { from: accounts('patient_1').address }
        )
      })
      .then((value) => {
        assert.equal(value, ipfs)
      })
    })

    it('should throw when a user has not registered', () => {
      const { contract, instance } = Registry()
      return contract
      .then(() => {
        return instance().getStore(
          accounts('patient_2').address, { from: accounts('patient_1').address }
        )
      })
      .catch((err) => {
        assert(isThrow(err))
      })
    })

  })

  describe('getting groups', () => {

    it('should return an empty array before groups are created', () => {
      const { contract, instance } = Registry()
      return contract
      .then(() => instance().getGroups({ from: accounts('gmc').address }))
      .then((groups) => assert.equal(groups.length, 0))
    })

    it('should return array of groups', () => {
      const { contract, instance } = Registry(true)
      const { contract: group1, instance: groupInstance1 } = Group(accounts('gmc').address, true)
      const { contract: group2, instance: groupInstance2 } = Group(accounts('gmc').address, true)
      const { contract: group3, instance: groupInstance3 } = Group(accounts('gmc').address, true)
      const { contract: group4, instance: groupInstance4 } = Group(accounts('gmc').address, true)
      return contract
      .then(() => group1)
      .then(() => group2)
      .then(() => group3)
      .then(() => group4)
      .then(() => instance().addGroup(groupInstance1().address, { from: accounts('gmc').address }))
      .then(() => instance().addGroup(groupInstance2().address, { from: accounts('gmc').address }))
      .then(() => instance().addGroup(groupInstance3().address, { from: accounts('gmc').address }))
      .then(() => instance().addGroup(groupInstance4().address, { from: accounts('gmc').address }))
      .then(() => instance().getGroups({ from: accounts('gmc').address }))
      .then((groups) => {
        assert.equal(groups.length, 4)
        assert.equal(groups[0], groupInstance1().address)
        assert.equal(groups[1], groupInstance2().address)
        assert.equal(groups[2], groupInstance3().address)
        assert.equal(groups[3], groupInstance4().address)
      })
    })

  })

  describe('adding groups', () => {

    it('should allow adding a group contract', () => {
      const { contract, instance } = Registry(true)
      const { contract: group, instance: groupInstance } = Group(accounts('gmc').address, true)
      return contract
      .then(() => group)
      .then(() => instance().addGroup(groupInstance().address, { from: accounts('gmc').address }))
      .then(() => instance().getGroups({ from: accounts('gmc').address }))
      .then((groups) => {
        assert.equal(groups.length, 1)
        assert.equal(groups[0], groupInstance().address)
      })
    })

  })

})
