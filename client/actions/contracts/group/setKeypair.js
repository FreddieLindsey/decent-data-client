// Add store
export const GROUP_SET_KEYPAIR_PENDING = 'GROUP_SET_KEYPAIR_PENDING'
export const GROUP_SET_KEYPAIR_SUCCESS = 'GROUP_SET_KEYPAIR_SUCCESS'
export const GROUP_SET_KEYPAIR_ERROR = 'GROUP_SET_KEYPAIR_ERROR'

export const groupSetKeypair = (contract, member) => {
  return async function(dispatch, getState) {
    const { address } = getState().security

    // Add store to registry
    dispatch(groupSetKeypairPending(address, contract, member))
    try {
      const group = contracts.Group.at(contract)
      await group.setPrivateKey(...privateHash, { from: address })
      await group.setPublicKey(...publicHash, { from: address })
      dispatch(groupSetKeypairSuccess(address, contract, member))
    } catch (err) {
      dispatch(groupSetKeypairError(address, contract, member, err))
    }
  }
}

export const groupSetKeypairPending = (identity, group) => ({
  type: GROUP_SET_KEYPAIR_PENDING,
  identity,
  group
})

export const groupSetKeypairSuccess = (identity, group) => ({
  type: GROUP_SET_KEYPAIR_SUCCESS,
  identity,
  group
})

export const groupSetKeypairError = (identity, group, error) => ({
  type: GROUP_SET_KEYPAIR_ERROR,
  identity,
  group,
  error
})
