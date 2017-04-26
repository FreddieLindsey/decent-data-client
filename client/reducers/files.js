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
      return handleFileSubmitSuccess(state, action.path)
    case FILE_SUBMIT_ERROR:
      return handleFileSubmitError(state, action.path, action.error)
    case FILE_RETRIEVE_PENDING:
      return handleFileRetrievePending(state, action.path)
    case FILE_RETRIEVE_SUCCESS:
      return handleFileRetrieveSuccess(state, action.path, action.content)
    case FILE_RETRIEVE_ERROR:
      return handleFileRetrieveError(state, action.path, action.error)
  }
  return state
}

const validateFile = (file) => {
  return {
    retrieving: false,
    loading: false,
    submitting: false,
    error: null,
    content: null,
    mime: null,
    ...file
  }
}

const handleFileLoadPending = (state, path) => {
  let loaded = state.loaded
  loaded[path] = validateFile({ loading: true })
  return {
    ...state,
    loaded
  }
}

const handleFileLoadSuccess = (state, path, content, mime) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    ...loaded[path], content, mime, loading: false
  })
  return {
    ...state,
    loaded
  }
}

const handleFileLoadError = (state, path, error) => {
  let loaded = state.loaded
  loaded[path] = validateFile({
    ...loaded[path], error, loading: false
  })
  return {
    ...state,
    loaded
  }
}

const handleFileSubmitPending = (state, path) => {
  let loaded = state.loaded
  loaded[path] = validateFile({ ...loaded[path], submitting: true })
  return {
    ...state,
    loaded
  }
}

const handleFileSubmitSuccess = (state, path) => {
  let { loaded, stored } = state
  stored[path] = validateFile({ ...loaded[path], submitting: false })
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
    ...loaded[path], submitting: false, error
  })
  return {
    ...state,
    loaded
  }
}

const handleFileRetrievePending = (state, path) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], retrieving: true
  })
  return {
    ...state,
    stored
  }
}

const handleFileRetrieveSuccess = (state, path, content) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], content, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

const handleFileRetrieveError = (state, path, error) => {
  let stored = state.stored
  stored[path] = validateFile({
    ...stored[path], error, retrieving: false
  })
  return {
    ...state,
    stored
  }
}

export default files
