import concat from 'concat-stream'
import through from 'through2'
import request from 'superagent'

import {
  fileRetrievePending,
  fileRetrieveSuccess,
  fileRetrieveError
} from '../../files'

import {
  HashByte
} from '../../../../utils'

// Get path from index
export const IPFSSTORAGE_GET_PENDING = 'IPFSSTORAGE_GET_PENDING'
export const IPFSSTORAGE_GET_SUCCESS = 'IPFSSTORAGE_GET_SUCCESS'
export const IPFSSTORAGE_GET_ERROR   = 'IPFSSTORAGE_GET_ERROR'

export const ipfsStorageGet = (path, address = undefined) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storageIdentity = address || identity
    const storage = getState().IPFSStorage.identities[storageIdentity].address
    let required = {}
    dispatch(ipfsStorageGetPending(storageIdentity, path))
    contracts.IPFSStorage.at(storage)
    .getReencryptionKey({ from: identity })
    .then((value) => {
      const hash = value.map((v) => HashByte.toHash(v)).join('')
      window.ipfs.get(hash, (err, stream) => {
        if (err)
          throw new Error('Could not retrieve reencryption key.')

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
          required.reencryptionKey = files[0].content.toString()
          contracts.IPFSStorage.at(storage)
          .get(path, { from: identity })
          .then((value) => {
            const hash = value.map((v) => HashByte.toHash(v)).join('')
            dispatch(ipfsStorageGetSuccess(storageIdentity, path, hash))
            dispatch(fileRetrievePending(storageIdentity, path))
            window.ipfs.get(hash, (err, stream) => {
              if (err) {
                dispatch(fileRetrieveError(storageIdentity, path, error))
                return
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
                const data = files[0].content.toString()
                const { encryption: { secretKey } } = getState().security
                request
                  .post('http://localhost:7000/encryption/reencrypt')
                  .send({ publicKey: required.reencryptionKey, data })
                  .then(res => {
                    required.encrypted = res.body.reencrypted
                    return request
                      .post('http://localhost:7000/encryption/decrypt/first')
                      .send({ secretKey, data: required.encrypted })
                  })
                  .then(res =>
                    dispatch(fileRetrieveSuccess(storageIdentity, path, res.body.decrypted)))
                  .catch(err => dispatch(fileRetrieveError(storageIdentity, path, err)))
              }))
            })
          })
          .catch((error) => {
            dispatch(ipfsStorageGetError(identity, path, error))
          })
        }))
      })
    })
  }
}

const ipfsStorageGetPending = (address, path) => {
  return {
    type: IPFSSTORAGE_GET_PENDING,
    address,
    path
  }
}

const ipfsStorageGetSuccess = (address, path, hash) => {
  return {
    type: IPFSSTORAGE_GET_SUCCESS,
    address,
    path,
    hash
  }
}

const ipfsStorageGetError   = (address, path, error) => {
  return {
    type: IPFSSTORAGE_GET_ERROR,
    address,
    path,
    error
  }
}
