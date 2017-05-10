import Request from 'superagent'

import { DecryptRSA } from '../../../utils'

// Retrieving files from IPFS
export const FILE_RETRIEVE_PENDING = 'FILE_RETRIEVE_PENDING'
export const FILE_RETRIEVE_SUCCESS = 'FILE_RETRIEVE_SUCCESS'
export const FILE_RETRIEVE_ERROR   = 'FILE_RETRIEVE_ERROR'

export const fileRetrieve = (path) => {
  return (dispatch, getState) => {
    dispatch(fileRetrievePending(path))
    Request
      .get(process.env.API_ENDPOINT + '/ipfs')
      .query({ path })
      .end((err, res) => {
        if (err) {
          dispatch(fileRetrieveError(path, err))
        } else {
          // Only attempt to decrypt if encrypted
          let content = res.text.indexOf('data') !== -1 ?
            res.text :
            DecryptRSA(res.text, getState().security.rsa.privateKey)
          dispatch(fileRetrieveSuccess(path, content))
        }
      })
  }
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
