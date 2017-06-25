// Add store
export const REGISTRY_GET_GROUPS_PENDING = 'REGISTRY_GET_GROUPS_PENDING'
export const REGISTRY_GET_GROUPS_SUCCESS = 'REGISTRY_GET_GROUPS_SUCCESS'
export const REGISTRY_GET_GROUPS_ERROR = 'REGISTRY_GET_GROUPS_ERROR'

export const registryGetGroups = (address) => {
  return async function(dispatch) {
    dispatch(registryGetGroupsPending(address))
    try {
      const registry = await contracts.Registry.deployed()
      const groups = await registry.getGroups({ from: address })
      dispatch(registryGetGroupsSuccess(address, groups))
    } catch (err) {
      dispatch(registryGetGroupsError(address, err))
    }
  }
}

export const registryGetGroupsPending = (identity) => ({
  type: REGISTRY_GET_GROUPS_PENDING,
  identity
})

export const registryGetGroupsSuccess = (identity, groups) => ({
  type: REGISTRY_GET_GROUPS_SUCCESS,
  identity,
  groups
})

export const registryGetGroupsError = (identity, error) => ({
  type: REGISTRY_GET_GROUPS_ERROR,
  identity,
  error
})
