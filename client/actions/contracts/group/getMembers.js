// Add store
export const GROUP_GET_MEMBERS_PENDING = 'GROUP_GET_MEMBERS_PENDING'
export const GROUP_GET_MEMBERS_SUCCESS = 'GROUP_GET_MEMBERS_SUCCESS'
export const GROUP_GET_MEMBERS_ERROR = 'GROUP_GET_MEMBERS_ERROR'

export const groupGetMembers = (contract) => {
  return async function(dispatch, getState) {
    const { address } = getState().security

    // Add store to registry
    dispatch(groupGetMembersPending(address, contract))
    try {
      const group = contracts.Group.at(contract)
      const members = await group.getMembers({ from: address })
      dispatch(groupGetMembersSuccess(address, contract, members))
    } catch (err) {
      dispatch(groupGetMembersError(address, contract, err))
    }
  }
}

const groupGetMembersPending = (identity) => ({
  type: GROUP_GET_MEMBERS_PENDING,
  identity
})

const groupGetMembersSuccess = (identity, group, members) => ({
  type: GROUP_GET_MEMBERS_SUCCESS,
  identity,
  group,
  members
})

const groupGetMembersError = (identity, group, error) => ({
  type: GROUP_GET_MEMBERS_ERROR,
  identity,
  group,
  error
})
