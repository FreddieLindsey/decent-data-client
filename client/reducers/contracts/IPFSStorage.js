import toastr from 'toastr'

import {
  IPFSSTORAGE_CREATE_PENDING,
  IPFSSTORAGE_CREATE_SUCCESS,
  IPFSSTORAGE_CREATE_ERROR,
  IPFSSTORAGE_ADD_REENCRYPTION_KEY_PENDING,
  IPFSSTORAGE_ADD_REENCRYPTION_KEY_SUCCESS,
  IPFSSTORAGE_ADD_REENCRYPTION_KEY_ERROR,
  // IPFSSTORAGE_SIZE_GET_PENDING,
  IPFSSTORAGE_SIZE_GET_SUCCESS,
  IPFSSTORAGE_SIZE_GET_ERROR,
  IPFSSTORAGE_INDEX_GET_PENDING,
  IPFSSTORAGE_INDEX_GET_SUCCESS,
  IPFSSTORAGE_INDEX_GET_ERROR,
  IPFSSTORAGE_SELECT_SUCCESS,
  REGISTRY_GET_STORE_SUCCESS,
  FILE_SUBMIT_SUCCESS,
} from '../../actions'

const initialState = {
  identities: {},
  pending: false,
  selected: undefined,
  error: undefined
}

export const IPFSStorage = (state = initialState, action) => {
  switch (action.type) {
    case IPFSSTORAGE_CREATE_PENDING:
      return { ...state, pending: true }
    case IPFSSTORAGE_CREATE_SUCCESS:
      return handleCreateSuccess(state, action.address, action.store)
    case IPFSSTORAGE_CREATE_ERROR:
      return handleCreateError(state, action.address, action.error)

    case IPFSSTORAGE_ADD_REENCRYPTION_KEY_PENDING:
      return { ...state, pending: true }
    case IPFSSTORAGE_ADD_REENCRYPTION_KEY_SUCCESS:
    case IPFSSTORAGE_ADD_REENCRYPTION_KEY_ERROR:
      return { ...state, pending: false }

    case REGISTRY_GET_STORE_SUCCESS:
      return handleRegistryGetSuccess(
        state, action.identity, action.store)

    case IPFSSTORAGE_SIZE_GET_SUCCESS:
      return handleSizeGetSuccess(state, action.address, action.size)
    case IPFSSTORAGE_SIZE_GET_ERROR:
      return handleSizeGetError(state, action.address, action.error)

    case IPFSSTORAGE_INDEX_GET_SUCCESS:
      return handleIndexGetSuccess(
        state, action.address, action.index, action.path)
    case IPFSSTORAGE_INDEX_GET_ERROR:
      return handleIndexGetError(state, action.address, action.error)

    case IPFSSTORAGE_SELECT_SUCCESS:
      return handleIpfsStorageSelect(state, action.address)
    case FILE_SUBMIT_SUCCESS:
      return handleFileSubmitSuccess(state, action.address, action.path)
  }
  return state
}

const validateStore = (store) => ({
  address: null,
  files: {},
  error: null,
  ...store
})

const handleCreateSuccess = (state, address, store) => {
  toastr.success(`Storage created at ${store} for identity ${address}`)
  let newState = { ...state }
  newState.identities[address] = validateStore({
    ...newState.identities[address], address: store, error: null
  })
  return newState
}

const handleCreateError = (state, address, error) => {
  toastr.error(`Storage could not be created for identity ${address}`)
  let newState = { ...state }
  newState.identities[address] = validateStore({ ...newState.identities[address], error })
  return newState
}

const handleRegistryGetSuccess = (state, identity, address) => {
  toastr.success(`Retrieved storage from ${address}`)
  let newState = { ...state }
  newState.identities[identity] = validateStore({
    ...newState.identities[identity],
    address,
    files: {}
  })
  return newState
}

const handleSizeGetSuccess = (state, address, size) => {
  toastr.success(`You have ${size} files in storage ${address}`)
  let identities = state.identities
  for (const i in identities)
    if (i === address)
      identities[i].size = size
  return {
    ...state,
    identities
  }
}

const handleSizeGetError   = (state, address, error) => {
  toastr.error(`Couldn't get size of storage ${address}`)
  let identities = state.identities
  for (const i in identities)
    if (i === address)
      identities[i].error = error
  return {
    ...state,
    identities
  }
}

const handleIndexGetSuccess = (state, address, index, path) => {
  let identities = { ...state.identities }
  identities[address].files[index] = { path }
  return {
    ...state,
    identities
  }
}

const handleIndexGetError   = (state, address, index, error) => {
  toastr.error(`Couldn't get index ${index} of storage ${address}`)
  let identities = state.identities
  identities[address].files[index] = { error }
  return {
    ...state,
    identities
  }
}

const handleIpfsStorageSelect = (state, selected) => {
  toastr.success(`Selected storage ${selected}`)
  return {
    ...state,
    selected
  }
}

const handleFileSubmitSuccess = (state, address, path) => {
  toastr.success(`File ${path} submitted to storage ${address}`)
  let identities = state.identities
  identities[address].files[identities[address].size] = { path }
  identities[address].size += 1
  return {
    ...state,
    identities
  }
}
