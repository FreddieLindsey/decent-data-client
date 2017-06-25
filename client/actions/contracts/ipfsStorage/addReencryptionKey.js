import concat from 'concat-stream'
import through from 'through2'
import request from 'superagent'

import {
  HashByte
} from '../../../../utils'

// Give write to a path
export const IPFSSTORAGE_ADD_REENCRYPTION_KEY_PENDING = 'IPFSSTORAGE_ADD_REENCRYPTION_KEY_PENDING'
export const IPFSSTORAGE_ADD_REENCRYPTION_KEY_SUCCESS = 'IPFSSTORAGE_ADD_REENCRYPTION_KEY_SUCCESS'
export const IPFSSTORAGE_ADD_REENCRYPTION_KEY_ERROR = 'IPFSSTORAGE_ADD_REENCRYPTION_KEY_ERROR'

export const ipfsStorageAddReencryptionKey = (address, done) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    const theirStorage = getState().IPFSStorage.identities[address].address
    dispatch(ipfsStorageAddReencryptionKeyPending(address))
    contracts.IPFSStorage.at(theirStorage)
    .getPublicKey({ from: getState().security.address })
    .then((value) => {
      const hash = value.map((v) => HashByte.toHash(v)).join('')
      window.ipfs.get(hash, (err, stream) => {
        if (err) {
          dispatch(ipfsStorageAddReencryptionKeyError(address, err))
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
          const publicKey = files[0].content.toString()
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
                  dispatch(ipfsStorageAddReencryptionKeyError(identity, err))
                  return
                }

                const hash1 = res[0].hash.slice(0, 32)
                const hash2 = res[0].hash.slice(32)
                contracts.IPFSStorage.at(storage)
                .addReencryptionKey(address, hash1, hash2, { from: getState().security.address })
                .then(() => {
                  dispatch(ipfsStorageAddReencryptionKeySuccess(address))
                  if (done) done()
                })
                .catch(err => dispatch(ipfsStorageAddReencryptionKeyError(identity, err)))
              })
            })
        }))
      })
    })
  }
}

export const ipfsStorageAddReencryptionKeyPending = (address) => ({
  type: IPFSSTORAGE_ADD_REENCRYPTION_KEY_PENDING,
  address
})

export const ipfsStorageAddReencryptionKeySuccess = (address) => ({
  type: IPFSSTORAGE_ADD_REENCRYPTION_KEY_SUCCESS,
  address
})

export const ipfsStorageAddReencryptionKeyError = (address, error) => ({
  type: IPFSSTORAGE_ADD_REENCRYPTION_KEY_ERROR,
  address,
  error
})
