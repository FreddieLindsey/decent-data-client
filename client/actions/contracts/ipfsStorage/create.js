import { Readable } from 'stream'
import request from 'superagent'

import {
  ipfsStorageAddReencryptionKeyPending,
  ipfsStorageAddReencryptionKeySuccess,
  ipfsStorageAddReencryptionKeyError,
  registryAddStorePending,
  registryAddStoreSuccess,
  registryAddStoreError
} from '../../'

// Create a new IPFSStorage contract
export const IPFSSTORAGE_CREATE_PENDING = 'IPFSSTORAGE_CREATE_PENDING'
export const IPFSSTORAGE_CREATE_SUCCESS = 'IPFSSTORAGE_CREATE_SUCCESS'
export const IPFSSTORAGE_CREATE_ERROR = 'IPFSSTORAGE_CREATE_ERROR'

export const ipfsStorageCreate = (address) => {
  return async function(dispatch, getState) {
    const { encryption: { secretKey, publicKey } } = getState().security

    // Publish public key
    dispatch(ipfsStorageCreatePending(address))
    window.ipfs.add([
      {
        path: 'publicKey',
        content: new Buffer(publicKey)
      }
    ], async function (err, res) {
      if (err) {
        dispatch(ipfsStorageCreateError(address, err))
        return
      }

      // Create storage
      const hash = res[0].hash
      try {
        const storage = await contracts.IPFSStorage.new(
          hash.slice(0, 32), hash.slice(32, 64), {
            from: address, gas: 4700000, gasPrice: 1000000000
          }
        )
        dispatch(ipfsStorageCreateSuccess(address, storage.address))

        // Create re-encryption key
        dispatch(ipfsStorageAddReencryptionKeyPending(address))
        const { body: { reencryptionKey } } = await request
          .post('http://localhost:7000/key/generate/reencryption')
          .send({ secretKey, publicKey })
        window.ipfs.add([{
          path: 'reencryptionKey',
          content: new Buffer(reencryptionKey)
        }], async function (err, res) {
          if (err) {
            dispatch(ipfsStorageAddReencryptionKeyError(address, err))
            return
          }

          const hash1 = res[0].hash.slice(0, 32)
          const hash2 = res[0].hash.slice(32)
          try {
            await contracts.IPFSStorage.at(storage.address)
            .addReencryptionKey(address, hash1, hash2, { from: address })
            dispatch(ipfsStorageAddReencryptionKeySuccess(address))
            dispatch(registryAddStorePending(address))
            try {
              const registry = await contracts.Registry.deployed()
              await registry.addStore(storage.address, { from: address })
              dispatch(registryAddStoreSuccess(address, storage.address))
            } catch (err) {
              dispatch(registryAddStoreError(address, err))
            }
          } catch (err) {
            dispatch(ipfsStorageAddReencryptionKeyError(address, err))
          }
        })
      } catch (err) {
        dispatch(ipfsStorageCreateError(err))
      }
    })
  }
}

const ipfsStorageCreatePending = () => ({
  type: IPFSSTORAGE_CREATE_PENDING
})

const ipfsStorageCreateSuccess = (address, store) => ({
  type: IPFSSTORAGE_CREATE_SUCCESS,
  address,
  store
})

const ipfsStorageCreateError = (address, error) => ({
  type: IPFSSTORAGE_CREATE_ERROR,
  address,
  error
})
