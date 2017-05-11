import Request from 'superagent'
import concat from 'concat-stream'
import through from 'through2'

import { HashByte, DecryptRSA } from '../../../utils'

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
          // Only attempt to decrypt if encrypted
          let content = res.text.indexOf('data') !== -1 ?
            res.text :
            DecryptRSA(res.text, getState().security.rsa.privateKey)
          dispatch(fileRetrieveSuccess(identity, path, content))
        }

        let files = []
        stream.pipe(through.obj((file, enc, next) => {
          file.content.pipe(concat((content) => {
            files.push({
              path: file.path,
              content: content
            })
            next()
          }))
        }, () => {
          const content =
            DecryptRSA(files[0].content, getState().security.rsa.privateKey)
          dispatch(fileRetrieveSuccess(path, content))
        }))
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
