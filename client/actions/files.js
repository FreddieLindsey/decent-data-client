import Request from 'superagent'

// Add a file
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

// Submitting files to IPFS
export const FILE_SUBMIT_PENDING = 'FILE_SUBMIT_PENDING'
export const FILE_SUBMIT_SUCCESS = 'FILE_SUBMIT_SUCCESS'
export const FILE_SUBMIT_ERROR   = 'FILE_SUBMIT_ERROR'

export const filesSubmit = () => {
  return (dispatch, getState) => {
    getState().files.loaded.forEach((f, i) => fileSubmit(dispatch, f, i))
  }
}

const fileSubmit = (dispatch, file, index) => {
  dispatch(fileSubmitPending())
  Request
    .post(process.env.API_ENDPOINT + '/ipfs')
    .send(file)
    .end((err, res) => {
      if (err) {
        dispatch(fileSubmitError(err))
      } else {
        dispatch(fileSubmitSuccess(res.body.additions))
      }
    })
}

const fileSubmitPending = () => {
  return {
    type: FILE_SUBMIT_PENDING
  }
}

const fileSubmitSuccess = (additions) => {
  return {
    type: FILE_SUBMIT_SUCCESS,
    additions
  }
}

const fileSubmitError = (error) => {
  return {
    type: FILE_SUBMIT_ERROR,
    error
  }
}

// Retrieving files from IPFS
export const FILE_RETRIEVE_PENDING = 'FILE_RETRIEVE_PENDING'
export const FILE_RETRIEVE_SUCCESS = 'FILE_RETRIEVE_SUCCESS'
export const FILE_RETRIEVE_ERROR   = 'FILE_RETRIEVE_ERROR'

export const fileRetrieve = (dispatch, path) => {
  dispatch(fileRetrievePending(path))
  Request
    .get(process.env.API_ENDPOINT + '/ipfs')
    .query({ path })
    .end((err, res) => {
      if (err) {
        dispatch(fileRetrieveError(err))
      } else {
        dispatch(fileRetrieveSuccess({
          path,
          content: res.body
        }))
      }
    })
}

const fileRetrievePending = (path) => {
  return {
    type: FILE_RETRIEVE_PENDING,
    path
  }
}

const fileRetrieveSuccess = (file) => {
  // path and content
  return {
    type: FILE_RETRIEVE_SUCCESS,
    ...file
  }
}

const fileRetrieveError = (error) => {
  return {
    type: FILE_RETRIEVE_ERROR,
    error
  }
}
