import {
  // FILE_LOAD_PENDING,
  FILE_LOAD_SUCCESS,
  FILE_LOAD_ERROR,
  // FILE_SUBMIT_PENDING,
  FILE_SUBMIT_SUCCESS,
  FILE_SUBMIT_ERROR,
} from '../actions'

const initialState = {
  loaded: [],
  stored: []
}

const files = (state = initialState, action) => {
  switch (action.type) {
    case FILE_LOAD_SUCCESS:
      return handleFileLoadSuccess(state, action.file)
    case FILE_LOAD_ERROR:
      return handleFileLoadError(state, action.file)
    case FILE_SUBMIT_SUCCESS:
      return handleFileSubmitSuccess(state, action.additions)
    case FILE_SUBMIT_ERROR:
      return handleFileSubmitError(state, action.error)
  }
  return state
}

const handleFileLoadSuccess = (state, file) => {
  return {
    ...state,
    loaded: [
      ...state.loaded,
      file
    ]
  }
}

const handleFileLoadError = (state, file) => {
  return {
    ...state,
    loaded: [
      ...state.loaded,
      file
    ]
  }
}

const handleFileSubmitSuccess = (state, additions) => {
  let loaded = state.loaded
  for (const a in additions) {
    loaded = loaded.filter((file) => {
      file.path !== a.path
    })
  }
  return {
    ...state,
    loaded,
    stored: [
      ...state.stored,
      ...additions
    ]
  }
}

const handleFileSubmitError = (state, error) => {
  return {
    ...state,
    stored: [
      ...state.stored,
      error
    ]
  }
}

export default files
