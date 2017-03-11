import {
  FILE_LOAD_PENDING,
  FILE_LOAD_SUCCESS,
  FILE_LOAD_ERROR
} from '../actions'

const initialState = []

const files = (state = initialState, action) => {
  switch (action.type) {
    case FILE_LOAD_SUCCESS:
      return handleFileLoadSuccess(state, action.file)
    case FILE_LOAD_ERROR:
      return handleFileLoadError(state, action.file)
  }
  return state
}

const handleFileLoadSuccess = (state, file) => {
  return [
    ...state,
    file
  ]
}

const handleFileLoadError = (state, file) => {
  return [
    ...state,
    file
  ]
}

export default files
