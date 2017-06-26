// Add Reencryption Key
export const GROUP_ADD_REENCRYPTION_KEY_PENDING = 'GROUP_ADD_REENCRYPTION_KEY_PENDING'
export const GROUP_ADD_REENCRYPTION_KEY_SUCCESS = 'GROUP_ADD_REENCRYPTION_KEY_SUCCESS'
export const GROUP_ADD_REENCRYPTION_KEY_ERROR = 'GROUP_ADD_REENCRYPTION_KEY_ERROR'

// TODO
export const groupAddReencryptionKey = (contract) => {
  return async function(dispatch, getState) {
    const { address } = getState().security

    // Add store to registry
    dispatch(groupAddReencryptionKeyPending(address, contract))
    try {
      const group = contracts.Group.at(contract)
      const members = await group.getMembers({ from: address })
      dispatch(groupAddReencryptionKeySuccess(address, contract, members))
    } catch (err) {
      dispatch(groupAddReencryptionKeyError(address, contract, err))
    }
  }
}

export const groupAddReencryptionKeyPending = (identity, group, member) => ({
  type: GROUP_ADD_REENCRYPTION_KEY_PENDING,
  identity,
  group,
  member
})

export const groupAddReencryptionKeySuccess = (identity, group, member) => ({
  type: GROUP_ADD_REENCRYPTION_KEY_SUCCESS,
  identity,
  group,
  member
})

export const groupAddReencryptionKeyError = (identity, group, member, error) => ({
  type: GROUP_ADD_REENCRYPTION_KEY_ERROR,
  identity,
  group,
  member,
  error
})
