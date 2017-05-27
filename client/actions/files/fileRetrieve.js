import Request from 'superagent'

import { Crypto } from '../../../utils'

// Retrieving files from IPFS
export const FILE_RETRIEVE_PENDING = 'FILE_RETRIEVE_PENDING'
export const FILE_RETRIEVE_SUCCESS = 'FILE_RETRIEVE_SUCCESS'
export const FILE_RETRIEVE_ERROR   = 'FILE_RETRIEVE_ERROR'

export const fileRetrieve = (path, address = undefined) => {
  return (dispatch, getState) => {
    const identity = address || getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address

    dispatch(fileRetrievePending(identity, path))
    Request
      .get(process.env.API_ENDPOINT + '/ipfs')
      .query({ path })
      .end((err, res) => {
        if (err) {
          dispatch(fileRetrieveError(identity, path, err))
        } else {
          let input = res.text
          const { rsa } = getState().security
          let aes = Crypto.decryptRSA(input.slice(0, 256))
          let iv = Crypto.decryptRSA(input.slice(256, 512))
          let content = Crypto.decryptAES(input.slice(512), aes, iv)

          dispatch(fileRetrieveSuccess(identity, path, content))
        }
      })
  }
}

export const fileRetrievePending = (address, path) => {
  return {
    type: FILE_RETRIEVE_PENDING,
    address,
    path
  }
}

export const fileRetrieveSuccess = (address, path, content) => {
  // path and content
  return {
    type: FILE_RETRIEVE_SUCCESS,
    address,
    path,
    content
  }
}

export const fileRetrieveError = (address, path, error) => {
  return {
    type: FILE_RETRIEVE_ERROR,
    address,
    path,
    error
  }
}
