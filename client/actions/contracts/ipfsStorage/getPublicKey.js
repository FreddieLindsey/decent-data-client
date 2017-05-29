import concat from 'concat-stream'
import through from 'through2'
import forge from 'node-forge'

import {
  HashByte
} from '../../../../utils'

// Get path from index
export const IPFSSTORAGE_GET_PUBLIC_KEY_PENDING = 'IPFSSTORAGE_GET_PUBLIC_KEY_PENDING'
export const IPFSSTORAGE_GET_PUBLIC_KEY_SUCCESS = 'IPFSSTORAGE_GET_PUBLIC_KEY_SUCCESS'
export const IPFSSTORAGE_GET_PUBLIC_KEY_ERROR   = 'IPFSSTORAGE_GET_PUBLIC_KEY_ERROR'

export const ipfsStorageGetPublicKey = (identity) => {
  return (dispatch, getState) => {
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageGetPublicKeyPending(identity))
    contracts.IPFSStorage.at(storage)
    .getPublicKey()
    .then((value) => {
      const hash = value.map((v) => HashByte.toHash(v)).join('')
      window.ipfs.get(hash, (err, stream) => {
        if (err) {
          dispatch(ipfsStorageGetPublicKeyError(identity, error))
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
          const input = files[0].content.toString()
          const publicKey = forge.pki.rsa.setPublicKey(input)
          dispatch(ipfsStorageGetPublicKeySuccess(identity, publicKey))
        }))
      })
    })
    .catch((error) => {
      dispatch(ipfsStorageGetPublicKeyError(identity, error))
    })
  }
}

const ipfsStorageGetPublicKeyPending = (address) => {
  return {
    type: IPFSSTORAGE_GET_PUBLIC_KEY_PENDING,
    address
  }
}

const ipfsStorageGetPublicKeySuccess = (address, publicKey) => {
  return {
    type: IPFSSTORAGE_GET_PUBLIC_KEY_SUCCESS,
    address,
    publicKey
  }
}

const ipfsStorageGetPublicKeyError   = (address, error) => {
  return {
    type: IPFSSTORAGE_GET_PUBLIC_KEY_ERROR,
    address,
    error
  }
}
