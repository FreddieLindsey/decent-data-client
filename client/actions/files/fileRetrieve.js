import Request from 'superagent'

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
