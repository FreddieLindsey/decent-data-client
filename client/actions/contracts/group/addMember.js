// Add store
export const GROUP_ADD_MEMBER_PENDING = 'GROUP_ADD_MEMBER_PENDING'
export const GROUP_ADD_MEMBER_SUCCESS = 'GROUP_ADD_MEMBER_SUCCESS'
export const GROUP_ADD_MEMBER_ERROR = 'GROUP_ADD_MEMBER_ERROR'

export const groupAddMember = (contract, member) => {
  return async function(dispatch, getState) {
    const { address } = getState().security

    // Add store to registry
    dispatch(groupAddMemberPending(address, contract, member))
    try {
      const group = contracts.Group.at(contract)
      await group.register(member, { from: address })
      dispatch(groupAddMemberSuccess(address, contract, member))
    } catch (err) {
      dispatch(groupAddMemberError(address, contract, member, err))
    }
  }
}

const groupAddMemberPending = (identity, group, member) => ({
  type: GROUP_ADD_MEMBER_PENDING,
  identity,
  group,
  member
})

const groupAddMemberSuccess = (identity, group, member) => ({
  type: GROUP_ADD_MEMBER_SUCCESS,
  identity,
  group,
  member
})

const groupAddMemberError = (identity, group, member, error) => ({
  type: GROUP_ADD_MEMBER_ERROR,
  identity,
  group,
  member,
  error
})
