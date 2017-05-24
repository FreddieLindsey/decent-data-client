import {
  FILE_LOAD_PENDING,
  FILE_LOAD_SUCCESS,
  FILE_LOAD_ERROR,
  FILE_SUBMIT_PENDING,
  FILE_SUBMIT_SUCCESS,
  FILE_SUBMIT_ERROR,
  FILE_RETRIEVE_PENDING,
  FILE_RETRIEVE_SUCCESS,
  FILE_RETRIEVE_ERROR,
  FILE_CHANGE_PATH,
  FILE_LOADED_CLEAR,
  // IPFSSTORAGE_INDEX_GET_PENDING,
  IPFSSTORAGE_INDEX_GET_SUCCESS,
  IPFSSTORAGE_INDEX_GET_ERROR,
  // IPFSSTORAGE_SIZE_SHARED_GET_PENDING,
  IPFSSTORAGE_SIZE_SHARED_GET_SUCCESS,
  IPFSSTORAGE_SIZE_SHARED_GET_ERROR,
  // IPFSSTORAGE_GIVE_READ_PENDING,
  IPFSSTORAGE_GIVE_READ_SUCCESS,
  IPFSSTORAGE_GIVE_READ_ERROR,
  // IPFSSTORAGE_GIVE_WRITE_PENDING,
  IPFSSTORAGE_GIVE_WRITE_SUCCESS,
  IPFSSTORAGE_GIVE_WRITE_ERROR,
} from '../actions'

const initialState = {
  loaded: {},
  stored: {}
}

const files = (state = initialState, action) => {
  switch (action.type) {
    case FILE_LOAD_PENDING:
      return handleFileLoadPending(state, action.path)
    case FILE_LOAD_SUCCESS:
      return handleFileLoadSuccess(state, action.path, action.content, action.mime)
    case FILE_LOAD_ERROR:
      return handleFileLoadError(state, action.path, action.error)
    case FILE_SUBMIT_SUCCESS:
      return handleFileSubmitSuccess(state, action.path, `${action.address}/${action.path}`)
    case FILE_SUBMIT_ERROR:
      return handleFileSubmitError(state, `${action.address}/${action.path}`, action.error)
    case FILE_RETRIEVE_PENDING:
      return handleFileRetrievePending(state, `${action.address}/${action.path}`)
    case FILE_RETRIEVE_SUCCESS:
      return handleFileRetrieveSuccess(state, `${action.address}/${action.path}`, action.content)
    case FILE_RETRIEVE_ERROR:
      return handleFileRetrieveError(state, `${action.address}/${action.path}`, action.error)
    case FILE_CHANGE_PATH:
      return handleFileChangePath(
        state, `${action.address}/${action.oldPath}`, `${action.address}/${action.newPath}`)
    case FILE_LOADED_CLEAR:
      return handleFileLoadedClear(state)
    case IPFSSTORAGE_SIZE_SHARED_GET_SUCCESS:
      return handleIpfsStorageSizeSharedGetSuccess(
        state, `${action.address}/${action.path}`, action.size
      )
    case IPFSSTORAGE_INDEX_GET_SUCCESS:
      return handleIpfsStorageIndexGetSuccess(
        state, action.index, `${action.address}/${action.path}`)
    case IPFSSTORAGE_INDEX_GET_ERROR:
      return handleIpfsStorageIndexGetError(state, action.index, action.error)
    case IPFSSTORAGE_GIVE_READ_SUCCESS:
      return handleIpfsStorageGiveReadSuccess(
        state, `${action.identity}/${action.path}`, action.address)
    case IPFSSTORAGE_GIVE_WRITE_SUCCESS:
      return handleIpfsStorageGiveWriteSuccess(
        state, `${action.identity}/${action.path}`, action.address)
  }
  return state
}

const validateFile = (file) => {
  return {
    retrieving: false,
    retrieved: false,
    loading: false,
    loaded: false,
    submitting: false,
    submitted: false,
    error: null,
    content: null,
    mime: null,
    writable: false,
    readable: false,
    sharing: {
      parties: [],
      size: -1
    },
    ...file
  }
}

const handleFileLoadPending = (state, path) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    loading: true, loaded: false
  })
  return {
    ...state,
    loaded
  }
}

const handleFileLoadSuccess = (state, path, content, mime) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    ...loaded[path], content, mime, loading: false, loaded: true
  })
  return {
    ...state,
    loaded
  }
}

const handleFileLoadError = (state, path, error) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    ...loaded[path], error, loading: false, loaded: false
  })
  return {
    ...state,
    loaded
  }
}

const handleFileSubmitPending = (state, path) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    ...loaded[path], submitting: true, submitted: false
  })
  return {
    ...state,
    loaded
  }
}

const handleFileSubmitSuccess = (state, path, newPath) => {
  let { loaded, stored } = state
  stored[newPath] = validateFile({
    ...loaded[path], submitting: false, submitted: true
  })
  delete loaded[path]
  return {
    ...state,
    stored,
    loaded
  }
}

const handleFileSubmitError = (state, path, error) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    ...loaded[path], submitting: false, submitted: false, error
  })
  return {
    ...state,
    loaded
  }
}

const handleFileRetrievePending = (state, path) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], retrieved: false, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

const handleFileRetrieveSuccess = (state, path, content) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], content, retrieved: true, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

const handleFileRetrieveError = (state, path, error) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], error, retrieved: false, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

const handleFileChangePath = (state, oldPath, newPath) => {
  let loaded = state.loaded
  let old = loaded[oldPath]
  delete loaded[oldPath]
  loaded[newPath] = old
  return {
    ...state,
    loaded
  }
}

const handleFileLoadedClear = (state) => {
  return {
    ...state,
    loaded: {}
  }
}

const handleIpfsStorageIndexGetSuccess = (state, index, path) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], index, retrieved: false, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

const handleIpfsStorageIndexGetError = (state, index, error) => {
  let stored = state.stored
  stored['Errored retrieving path for index ' + index] = validateFile({
    ...stored[path], error, retrieved: false, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

const handleIpfsStorageSizeSharedGetSuccess = (state, path, size) => {
  let stored = state.stored
  stored[path].sharing.size = size
  return {
    ...state,
    stored
  }
}

const handleIpfsStorageGiveReadSuccess = (state, path, address) => {
  let stored = state.stored
  let file = stored[path]
  let found = false
  for (const i in file.sharing.parties) {
    const party = file.sharing.parties[i]
    if (party.address === address) {
      found = true
      if (party.permissions % 2 < 1) party.permissions += 1
    }
  }
  if (!found)
    file.sharing.parties.push({ address, permissions: 1 })
  return {
    ...state,
    stored
  }
}

const handleIpfsStorageGiveWriteSuccess = (state, path, address) => {
  let stored = state.stored
  let file = stored[path]
  let found = false
  for (const i in file.sharing.parties) {
    const party = file.sharing.parties[i]
    if (party.address === address) {
      found = true
      if (party.permissions % 4 < 2) party.permissions += 2
    }
  }
  if (!found)
    file.sharing.parties.push({ address, permissions: 2 })
  return {
    ...state,
    stored
  }
}

export default files
