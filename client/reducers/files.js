import {
  FILE_LOAD_PENDING,
  FILE_LOAD_SUCCESS,
  FILE_LOAD_ERROR
} from '../actions'

const initialState = []

const files = (state = initialState, action) => {
  switch (action.type) {
    case FILE_LOAD_SUCCESS:
      return handleFileLoadSuccess(state, action.buffer)
    case FILE_LOAD_ERROR:
      return handleFileLoadError(state, action.buffer)
  }
  return state
}

const initFileBuffer = (buffer) => {
  return { buffer }
}

const initFileError = (error) => {
  return { error }
}

const handleFileLoadSuccess = (state, buffer) => {
  return [
    ...state,
    initFileBuffer(buffer)
  ]
}

const handleFileLoadError = (state, error) => {
  return [
    initFileError(error),
    ...state
  ]
}

export default files
