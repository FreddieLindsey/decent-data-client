import {
  LOGOUT,
  // IPFSSTORAGE_CREATE_PENDING,
  IPFSSTORAGE_CREATE_SUCCESS,
  IPFSSTORAGE_CREATE_ERROR,
  // IPFSSTORAGE_SIZE_GET_PENDING,
  IPFSSTORAGE_SIZE_GET_SUCCESS,
  IPFSSTORAGE_SIZE_GET_ERROR,
  IPFSSTORAGE_INDEX_GET_PENDING,
  IPFSSTORAGE_INDEX_GET_SUCCESS,
  IPFSSTORAGE_INDEX_GET_ERROR,
  IPFSSTORAGE_SELECT_SUCCESS,
  REGISTRY_GET_STORE_SUCCESS,
  FILE_SUBMIT_SUCCESS,
  LOAD_ECDSA_PRIVATE_KEY_SUCCESS
} from '../../actions'

const initialState = {
  mine: undefined,
  meta: {
    firstTime: false,
  },
  identities: {},
  selected: undefined,
  error: undefined
}

export const IPFSStorage = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...initialState }
    case IPFSSTORAGE_CREATE_SUCCESS:
      return handleCreateSuccess(state, action.address)
    case IPFSSTORAGE_CREATE_ERROR:
      return handleCreateError(state, action.error)
    case REGISTRY_GET_STORE_SUCCESS:
      return handleRegistryGetSuccess(
        state, action.identity, action.address, action.owned)
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
    case LOAD_ECDSA_PRIVATE_KEY_SUCCESS:
      return handleLoadECDSAPrivateKeySuccess(state)
  }
  return state
}

const handleCreateSuccess = (state, address) => {
  let mine = address
  let meta = state.meta
  meta.firstTime = true
  return {
    ...state,
    mine,
    meta
  }
}

const handleCreateError = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleRegistryGetSuccess = (state, identity, address, owned) => {
  let { mine, identities } = state
  identities[identity] = {
    ...identities[identity],
    address,
    files: {}
  }
  if (owned) mine = address
  return {
    ...state,
    mine,
    identities
  }
}

const handleSizeGetSuccess = (state, address, size) => {
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
  let identities = state.identities
  identities[address].files[index] = { path }
  return {
    ...state,
    identities
  }
}

const handleIndexGetError   = (state, address, index, error) => {
  let identities = state.identities
  identities[address].files[index] = { error }
  return {
    ...state,
    identities
  }
}

const handleIpfsStorageSelect = (state, selected) => {
  return {
    ...state,
    selected
  }
}

const handleFileSubmitSuccess = (state, address, path) => {
  let identities = state.identities
  identities[address].files[identities[address].size] = { path }
  identities[address].size += 1
  return {
    ...state,
    identities
  }
}

const handleLoadECDSAPrivateKeySuccess = (state) => ({ ...initialState })
