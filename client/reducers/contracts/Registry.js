import {
  GET_ACCOUNTS_SUCCESS,
  IPFSSTORAGE_CREATE_SUCCESS,
  REGISTRY_ADD_STORE_SUCCESS,
  REGISTRY_ADD_STORE_ERROR,
  REGISTRY_GET_STORE_SUCCESS,
  REGISTRY_GET_STORE_ERROR,
} from '../../actions'

const initialState = {}

export const Registry = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS_SUCCESS:
      return handleGetAccountsSuccess(state, action.accounts)
    case REGISTRY_ADD_STORE_SUCCESS:
      return handleRegistryAddStoreSuccess(state, action.identity, action.store)
    case REGISTRY_ADD_STORE_ERROR:
      return handleRegistryAddStoreError(state, action.identity, action.error)
    case REGISTRY_GET_STORE_SUCCESS:
      return handleRegistryGetStoreSuccess(state, action.identity, action.store)
    case REGISTRY_GET_STORE_ERROR:
      return handleRegistryGetStoreError(state, action.identity, action.error)
    case IPFSSTORAGE_CREATE_SUCCESS:
      return handleIpfsStorageCreateSuccess(state, action.address, action.store)
  }
  return state
}

const validateStore = (store) => ({
  address: null,
  error: null,
  ...store
})

const handleGetAccountsSuccess = (state, accounts) => {
  let newState = { ...state }
  for (const i of accounts)
    newState[i] = validateStore(newState[i])
  return newState
}

const handleRegistryAddStoreSuccess = (state, identity, store) => {
  let newState = { ...state }
  newState[identity] = validateStore({ address: store })
  return newState
}

const handleRegistryAddStoreError = (state, identity, error) => {
  let newState = { ...state }
  newState[identity] = validateStore({ ...newState[identity], error })
  return newState
}

const handleRegistryGetStoreSuccess = (state, identity, store) => {
  let newState = { ...state }
  newState[identity] = validateStore({ address: store })
  return newState
}

const handleRegistryGetStoreError = (state, identity, error) => {
  let newState = { ...state }
  newState[identity] = validateStore({ ...newState[identity], error })
  return newState
}

const handleIpfsStorageCreateSuccess = (state, identity, store) => {
  let newState = { ...state }
  newState[identity] = validateStore({ address: store })
  return newState
}
