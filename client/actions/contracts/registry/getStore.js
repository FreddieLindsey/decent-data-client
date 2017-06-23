// Add store
export const REGISTRY_GET_STORE_PENDING = 'REGISTRY_GET_STORE_PENDING'
export const REGISTRY_GET_STORE_SUCCESS = 'REGISTRY_GET_STORE_SUCCESS'
export const REGISTRY_GET_STORE_ERROR = 'REGISTRY_GET_STORE_ERROR'

export const registryGetStore = (address) => {
  return async function(dispatch) {
    dispatch(registryGetStorePending(address))
    try {
      const registry = await contracts.Registry.deployed()
      const store = await registry.getStore(address)
      dispatch(registryGetStoreSuccess(address, store))
    } catch (err) {
      dispatch(registryGetStoreError(address, err))
    }
  }
}

export const registryGetStorePending = (identity) => ({
  type: REGISTRY_GET_STORE_PENDING,
  identity
})

export const registryGetStoreSuccess = (identity, store) => ({
  type: REGISTRY_GET_STORE_SUCCESS,
  identity,
  store
})

export const registryGetStoreError = (identity, error) => ({
  type: REGISTRY_GET_STORE_ERROR,
  identity,
  error
})
