// Add store
export const REGISTRY_GET_STORE_PENDING = 'REGISTRY_GET_STORE_PENDING'
export const REGISTRY_GET_STORE_SUCCESS = 'REGISTRY_GET_STORE_SUCCESS'
export const REGISTRY_GET_STORE_ERROR = 'REGISTRY_GET_STORE_ERROR'

export const registryGetStore = () => {
  return (dispatch, getState) => {
    const { address } = getState().security

    dispatch(registryGetStorePending())
    contracts.Registry.deployed()
    .then((instance) => {
      return instance.getStore(address, { from: address })
    })
    .then((store) => dispatch(registryGetStoreSuccess(store)))
    .catch((err) => dispatch(registryGetStoreError(err)))
  }
}

const registryGetStorePending = () => ({
  type: REGISTRY_GET_STORE_PENDING
})

const registryGetStoreSuccess = () => ({
  type: REGISTRY_GET_STORE_SUCCESS
})

const registryGetStoreError = (error) => ({
  type: REGISTRY_GET_STORE_ERROR,
  error
})
