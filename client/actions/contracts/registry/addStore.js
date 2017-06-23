// Add store
export const REGISTRY_ADD_STORE_PENDING = 'REGISTRY_ADD_STORE_PENDING'
export const REGISTRY_ADD_STORE_SUCCESS = 'REGISTRY_ADD_STORE_SUCCESS'
export const REGISTRY_ADD_STORE_ERROR = 'REGISTRY_ADD_STORE_ERROR'

export const registryAddStore = (address) => {
  return async function(dispatch, getState) {
    const { address: storage } = getState().IPFSStorage.identities[address]

    // Add store to registry
    dispatch(registryAddStorePending(address))
    try {
      const registry = await contracts.Registry.deployed()
      await registry.addStore(storage, { from: address })
      dispatch(registryAddStoreSuccess(address, storage))
    } catch (err) {
      dispatch(registryAddStoreError(address, err))
    }
  }
}

const registryAddStorePending = (identity) => ({
  type: REGISTRY_ADD_STORE_PENDING,
  identity
})

const registryAddStoreSuccess = (identity, store) => ({
  type: REGISTRY_ADD_STORE_SUCCESS,
  identity,
  store
})

const registryAddStoreError = (identity, error) => ({
  type: REGISTRY_ADD_STORE_ERROR,
  identity,
  error
})
