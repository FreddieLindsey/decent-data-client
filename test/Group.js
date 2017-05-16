import {
  Group,
  IPFSStorageWithPublicKey,

  accounts,
  isThrow
} from './utils'

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
        assert(v)
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

    xit('should allow the authority to add a member', () => {

    })

    xit('should not allow anyone else to add a member', () => {

    })

  })

})
