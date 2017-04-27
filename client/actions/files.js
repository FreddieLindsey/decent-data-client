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
    const index = getState().files.loaded
    for (const k in index) {
      fileSubmit(dispatch, index[k], k)
    }
  }
}

const fileSubmit = (dispatch, file, path) => {
  dispatch(fileSubmitPending(path))
  Request
    .post(process.env.API_ENDPOINT + '/ipfs')
    .send({
      path,
      content: file.content
    })
    .end((err, res) => {
      if (err) {
        dispatch(fileSubmitError(path, err))
      } else {
        dispatch(fileSubmitSuccess(path))
      }
    })
}

const fileSubmitPending = (path) => {
  return {
    type: FILE_SUBMIT_PENDING,
    path
  }
}

const fileSubmitSuccess = (path) => {
  return {
    type: FILE_SUBMIT_SUCCESS,
    path
  }
}

const fileSubmitError = (path, error) => {
  return {
    type: FILE_SUBMIT_ERROR,
    path,
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
        dispatch(fileRetrieveError(path, err))
      } else {
        dispatch(fileRetrieveSuccess(path, res.text))
      }
    })
}

const fileRetrievePending = (path) => {
  return {
    type: FILE_RETRIEVE_PENDING,
    path
  }
}

const fileRetrieveSuccess = (path, content) => {
  // path and content
  return {
    type: FILE_RETRIEVE_SUCCESS,
    path,
    content
  }
}

const fileRetrieveError = (error) => {
  return {
    type: FILE_RETRIEVE_ERROR,
    error
  }
}
