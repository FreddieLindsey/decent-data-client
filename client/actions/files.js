// Add a file
export const FILE_LOAD_PENDING = 'FILE_LOAD_PENDING'
export const FILE_LOAD_SUCCESS = 'FILE_LOAD_SUCCESS'
export const FILE_LOAD_ERROR   = 'FILE_LOAD_ERROR'

export const filesLoad = (dispatch, files) => {
  for (const f in files) {
    fileLoad(dispatch, files[f])
  }
}

export const fileLoad = (dispatch, file) => {
  dispatch(fileLoadPending())
  const reader = new FileReader()
  reader.onload = (f) => {
    dispatch(fileLoadSuccess(f.target.result))
  }
  reader.onerror = (err) => {
    dispatch(fileLoadError(err))
  }
  reader.readAsArrayBuffer(file)
}

const fileLoadPending = () => {
  return {
    type: FILE_LOAD_PENDING
  }
}

const fileLoadSuccess = (buffer) => {
  return {
    type: FILE_LOAD_SUCCESS,
    buffer
  }
}

const fileLoadError = (error) => {
  return {
    type: FILE_LOAD_ERROR,
    error
  }
}
