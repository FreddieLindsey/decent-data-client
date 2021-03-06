import toastr from 'toastr'

import { REHYDRATE } from 'redux-persist/constants'

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
    case REHYDRATE:
      return state
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
  toastr.info(`Retrieved ${accounts.length} unlocked accounts`)
  let newState = { ...state }
  for (const i of accounts)
    newState[i] = validateStore(newState[i])
  return newState
}

const handleRegistryAddStoreSuccess = (state, identity, store) => {
  toastr.success(`Added store to registry for identity ${identity}`)
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
  toastr.success(`Retrieved store from registry for identity ${identity}`)
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

const handleIpfsStorageGetPublicKeySuccess = (state, identity, publicKey) => {
  let nState = { ...state }
  let ident = nState.identities[identity] || {}
  nState.identities[identity] = validateIdentity({ ...ident, publicKey: {
    ...ident.publicKey, value: publicKey
  }})
  return nState
}
