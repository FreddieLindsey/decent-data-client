// Add store
export const REGISTRY_CREATE_GROUP_PENDING = 'REGISTRY_CREATE_GROUP_PENDING'
export const REGISTRY_CREATE_GROUP_SUCCESS = 'REGISTRY_CREATE_GROUP_SUCCESS'
export const REGISTRY_CREATE_GROUP_ERROR = 'REGISTRY_CREATE_GROUP_ERROR'

export const registryCreateGroup = (address) => {
  return async function(dispatch) {
    dispatch(registryCreateGroupPending(address))
    try {
      const registry = await contracts.Registry.deployed()
      const group = await contracts.Group.new({
        from: address, gasPrice: 100000000000, gas: 4712388
      })
      const groups = await registry.addGroup(group.address, { from: address })
      dispatch(registryCreateGroupSuccess(address, group))
    } catch (err) {
      dispatch(registryCreateGroupError(address, err))
    }
  }
}

export const registryCreateGroupPending = (identity) => ({
  type: REGISTRY_CREATE_GROUP_PENDING,
  identity
})

export const registryCreateGroupSuccess = (identity, group) => ({
  type: REGISTRY_CREATE_GROUP_SUCCESS,
  identity,
  group
})

export const registryCreateGroupError = (identity, error) => ({
  type: REGISTRY_CREATE_GROUP_ERROR,
  identity,
  error
})
