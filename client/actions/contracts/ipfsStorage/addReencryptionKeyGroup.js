import concat from 'concat-stream'
import through from 'through2'
import request from 'superagent'

import {
  HashByte
} from '../../../../utils'

// Give write to a path
export const IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_PENDING =
  'IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_PENDING'
export const IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_SUCCESS =
  'IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_SUCCESS'
export const IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_ERROR =
  'IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_ERROR'

export const ipfsStorageAddReencryptionKeyGroup = (name, done) => {
  return async function(dispatch, getState) {
    const identity = getState().security.address
    const { encryption: secretKey } = getState().security
    const storage = getState().IPFSStorage.identities[identity].address

    dispatch(ipfsStorageAddReencryptionKeyGroupPending(name))
    try {
      const groupAddress = await storage.getGroupAddress(name)
      const group = contracts.Group.at(groupAddress)
      const hash = (await group.getPublicKey()).map((v) => HashByte.toHash(v)).join('')
      const stream = await window.ipfs.get(hash)
      let files = []
      stream.pipe(through.obj((file, enc, next) => {
        file.content.pipe(concat((content) => {
          files.push({
            path: file.path,
            content: content
          })
          next()
        }))
      }, async function () {
        const publicKey = files[0].content.toString()
        const { body: { reencryptionKey } } = await request
          .post('http://localhost:7000/key/generate/reencryption')
          .send({ secretKey, publicKey })


        const key = new Buffer(res.body.reencryptionKey)
        const res = await window.ipfs.add([{
          path: 'reencryptionKey',
          content: key
        }])
        const hash1 = res[0].hash.slice(0, 32)
        const hash2 = res[0].hash.slice(32)
        await contracts.IPFSStorage.at(storage)
        .addReencryptionKey(groupAddress, hash1, hash2, { from: identity })
        dispatch(ipfsStorageAddReencryptionKeyGroupSuccess(name))
        done()
      }))
    } catch (err) {
      dispatch(ipfsStorageAddReencryptionKeyGroupError(name, err))
    }
  }
}

export const ipfsStorageAddReencryptionKeyGroupPending = (name) => ({
  type: IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_PENDING,
  name
})

export const ipfsStorageAddReencryptionKeyGroupSuccess = (name) => ({
  type: IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_SUCCESS,
  name
})

export const ipfsStorageAddReencryptionKeyGroupError = (name, error) => ({
  type: IPFSSTORAGE_ADD_REENCRYPTION_KEY_GROUP_ERROR,
  name,
  error
})
