import Request from 'superagent'

// Load a file
export const FILE_LOAD_PENDING = 'FILE_LOAD_PENDING'
export const FILE_LOAD_SUCCESS = 'FILE_LOAD_SUCCESS'
export const FILE_LOAD_ERROR   = 'FILE_LOAD_ERROR'

export const filesLoad = (files) => {
  return (dispatch) => {
    files.forEach(f => fileLoad(dispatch, f))
  }
}

const fileLoad = (dispatch, file) => {
  dispatch(fileLoadPending(file.name))
  const reader = new FileReader()
  reader.onload = (f) => {
    dispatch(fileLoadSuccess(file.name, f.target.result, file.type))
  }
  reader.onerror = (error) => {
    dispatch(fileLoadError(file.name, error))
  }
  reader.readAsDataURL(file)
}

const fileLoadPending = (path) => {
  return {
    type: FILE_LOAD_PENDING,
    path
  }
}

const fileLoadSuccess = (path, content, mime) => {
  return {
    type: FILE_LOAD_SUCCESS,
    path,
    content,
    mime
  }
}

const fileLoadError = (path, error) => {
  return {
    type: FILE_LOAD_ERROR,
    path,
    error
  }
}
