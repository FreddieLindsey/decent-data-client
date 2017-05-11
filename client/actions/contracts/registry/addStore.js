// Add store
export const REGISTRY_ADD_STORE_PENDING = 'REGISTRY_ADD_STORE_PENDING'
export const REGISTRY_ADD_STORE_SUCCESS = 'REGISTRY_ADD_STORE_SUCCESS'
export const REGISTRY_ADD_STORE_ERROR = 'REGISTRY_ADD_STORE_ERROR'

export const registryAddStore = () => {
  return (dispatch, getState) => {
    const state = getState()
    const { address } = state.security
    const { mine } = state.IPFSStorage

    dispatch(registryAddStorePending())
    contracts.Registry.deployed()
    .then((instance) => {
      return instance.addStore(mine, { from: address })
    })
    .then(() => dispatch(registryAddStoreSuccess()))
    .catch((err) => dispatch(registryAddStoreError(err)))
  }
}

const registryAddStorePending = () => ({
  type: REGISTRY_ADD_STORE_PENDING
})

const registryAddStoreSuccess = () => ({
  type: REGISTRY_ADD_STORE_SUCCESS
})

const registryAddStoreError = (error) => ({
  type: REGISTRY_ADD_STORE_ERROR,
  error
})
