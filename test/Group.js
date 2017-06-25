import {
  Group,
  IPFSStorage,

  accounts
} from './utils'

import { isThrow } from '../utils'

contract('Group', () => {

  const publicKeyHash = 'Qmc809239e912949d06d6a125e1c0cd5a4df0a5669'

  // Setup
  Group(accounts('gmc').address)

  describe('creating a group', () => {

    it('should be successful', () => {
      return Group(accounts('gmc').address).contract
    })

  })

  describe('getting membership status', () => {

    it('should be successful for a member', () => {
      const { contract, instance } = Group(accounts('gmc').address)
      return contract
      .then(() => instance().register(
        accounts('doctor').address, { from: accounts('gmc').address })
      )
      .then(() => instance().member(accounts('doctor').address))
      .then((v) => {
        assert(!!v)
      })
    })

    it('should be unsuccessful for a non-member', () => {
      const { contract, instance } = Group(accounts('gmc').address)
      return contract
      .then(() => instance().member(accounts('patient_1').address))
      .then((v) => {
        assert(!v)
      })
    })

  })

  describe('registering members', () => {

    it('should allow the authority to add a member', () => {
      const { contract, instance } = Group(accounts('gmc').address)
      return contract
      .then(() => instance().register(
        accounts('doctor').address, { from: accounts('gmc').address })
      )
    })

    it('should not allow anyone else to add a member', () => {
      const { contract, instance } = Group(accounts('gmc').address)
      return contract
      .then(() => instance().register(
        accounts('doctor').address
      ))
      .catch((err) => {
        assert(isThrow(err))
      })
    })

    it('should not allow adding a member that has been previously banned', () => {
      const { contract, instance } = Group(accounts('gmc').address, true)
      return contract
      .then(() => instance().register(
        accounts('doctor').address, { from: accounts('gmc').address })
      )
      .then(() => instance().invalidate(
        accounts('doctor').address, { from: accounts('gmc').address })
      )
      .then(() => instance().register(
        accounts('doctor').address, { from: accounts('gmc').address })
      )
      .catch((err) => {
        assert(isThrow(err))
      })
    })

  })

  describe('banning members', () => {

    it('should allow the authority to ban a member', () => {
      const { contract, instance } = Group(accounts('gmc').address, true)
      return contract
      .then(() => instance().invalidate(
        accounts('doctor').address, { from: accounts('gmc').address })
      )
    })

    it('should not allow anyone else to ban a member', () => {
      const { contract, instance } = Group(accounts('gmc').address)
      return contract
      .then(() => instance().invalidate(
        accounts('doctor').address
      ))
      .catch((err) => {
        assert(isThrow(err))
      })
    })

  })

  describe('member index', () => {

    it('should allow the authority to retrieve a list of members', () => {
      const { contract, instance } = Group(accounts('gmc').address, true)
      return contract
      .then(() => instance().getMembers({ from: accounts('gmc').address }))
      .then(members => assert.equal(members.length, 0))
      .then(() =>
        instance().register(accounts('doctor').address, { from: accounts('gmc').address }))
      .then(() =>
        instance().register(accounts('patient_1').address, { from: accounts('gmc').address }))
      .then(() =>
        instance().register(accounts('patient_2').address, { from: accounts('gmc').address }))
      .then(() => instance().getMembers({ from: accounts('gmc').address }))
      .then((members) => {
        assert.equal(members.length, 3)
        assert.equal(members[0], accounts('doctor').address)
        assert.equal(members[1], accounts('patient_1').address)
        assert.equal(members[2], accounts('patient_2').address)
      })
    })

    it('should not allow anyone else to retrieve a list of members', () => {
      const { contract, instance } = Group(accounts('gmc').address, true)
      return contract
      .then(() => instance().getMembers({ from: accounts('patient_1').address }))
      .catch((err) => assert(isThrow(err)))
    })

  })

})
