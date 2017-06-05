import { Readable } from 'stream'
import request from 'superagent'

import {
  ipfsStorageAddReencryptionKeyPending,
  ipfsStorageAddReencryptionKeySuccess,
  ipfsStorageAddReencryptionKeyError
} from '../../'

// Create a new IPFSStorage contract
export const IPFSSTORAGE_CREATE_PENDING = 'IPFSSTORAGE_CREATE_PENDING'
export const IPFSSTORAGE_CREATE_SUCCESS = 'IPFSSTORAGE_CREATE_SUCCESS'
export const IPFSSTORAGE_CREATE_ERROR = 'IPFSSTORAGE_CREATE_ERROR'

export const ipfsStorageCreate = () => {
  return (dispatch, getState) => {
    const { address, encryption: { publicKey } } = getState().security
    const content = new Buffer(publicKey)
    dispatch(ipfsStorageCreatePending())
    ipfs.add([
      {
        path: 'publicKey',
        content
      }
    ], (err, res) => {
      if (err) {
        dispatch(ipfsStorageCreateError(err))
      } else {
        const hash = res[0].hash
        contracts.IPFSStorage.new(
          hash.slice(0, 32), hash.slice(32, 64), {
            from: address, gas: 3000000, gasPrice: 10000000
          }
        )
        .then((instance) => {
          dispatch(ipfsStorageCreateSuccess(instance.address))
          dispatch(ipfsStorageAddReencryptionKeyPending(address))
          const { secretKey } = getState().security.encryption
          request
            .post('http://localhost:7000/key/generate/reencryption')
            .send({ secretKey, publicKey })
            .then(res => {
              const key = new Buffer(res.body.reencryptionKey)
              window.ipfs.add([{
                path: 'reencryptionKey',
                content: key
              }], (err, res) => {
                if (err) {
                  dispatch(ipfsStorageAddReencryptionKeyError(address, err))
                  return
                }

                const hash1 = res[0].hash.slice(0, 32)
                const hash2 = res[0].hash.slice(32)
                contracts.IPFSStorage.at(instance.address)
                .addReencryptionKey(address, hash1, hash2, { from: getState().security.address })
                .then(() => dispatch(ipfsStorageAddReencryptionKeySuccess(address)))
                .catch(err => dispatch(ipfsStorageAddReencryptionKeyError(identity, err)))
              })
            })
            .catch((err) => dispatch(ipfsStorageCreateError(err)))
        })
      }
    })
  }
}

const ipfsStorageCreatePending = () => ({
  type: IPFSSTORAGE_CREATE_PENDING
})

const ipfsStorageCreateSuccess = (address) => ({
  type: IPFSSTORAGE_CREATE_SUCCESS,
  address
})

const ipfsStorageCreateError = (error) => ({
  type: IPFSSTORAGE_CREATE_ERROR,
  error
})
