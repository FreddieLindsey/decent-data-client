// Add store
export const REGISTRY_GET_STORE_PENDING = 'REGISTRY_GET_STORE_PENDING'
export const REGISTRY_GET_STORE_SUCCESS = 'REGISTRY_GET_STORE_SUCCESS'
export const REGISTRY_GET_STORE_ERROR = 'REGISTRY_GET_STORE_ERROR'

export const registryGetStore = (address = undefined) => {
  return (dispatch, getState) => {
    const myaddress = getState().security.address
    const identity = address || myaddress
    const owned = identity === myaddress

    dispatch(registryGetStorePending(identity))
    contracts.Registry.deployed()
    .then((instance) => {
      return instance.getStore(identity, { from: myaddress })
    })
    .then((store) => dispatch(registryGetStoreSuccess(identity, store, owned)))
    .catch((err) => dispatch(registryGetStoreError(identity, err)))
  }
}

const registryGetStorePending = (identity) => ({
  type: REGISTRY_GET_STORE_PENDING,
  identity
})

const registryGetStoreSuccess = (identity, address, owned) => ({
  type: REGISTRY_GET_STORE_SUCCESS,
  identity,
  address,
  owned
})

const registryGetStoreError = (identity, error) => ({
  type: REGISTRY_GET_STORE_ERROR,
  identity,
  error
})
