import concat from 'concat-stream'
import through from 'through2'
import request from 'superagent'

import {
  HashByte
} from '../../../../utils'

// Add Reencryption Key
export const GROUP_ADD_REENCRYPTION_KEY_PENDING = 'GROUP_ADD_REENCRYPTION_KEY_PENDING'
export const GROUP_ADD_REENCRYPTION_KEY_SUCCESS = 'GROUP_ADD_REENCRYPTION_KEY_SUCCESS'
export const GROUP_ADD_REENCRYPTION_KEY_ERROR = 'GROUP_ADD_REENCRYPTION_KEY_ERROR'

export const groupAddReencryptionKey = (contract, member) => {
  return async function(dispatch, getState) {
    const { address, encryption: { secretKey } } = getState().security

    // Add store to registry
    dispatch(groupAddReencryptionKeyPending(address, contract, member))
    try {
      const group = contracts.Group.at(contract)

      const registry = await contracts.Registry.deployed()
      const storage = await contracts.IPFSStorage.at(await registry.getStore(member))
      const memberPublicKeyHash =
        (await storage.getPublicKey()).map((v) => HashByte.toHash(v)).join('')

      const groupPrivateKeyHash =
        (await group.getPrivateKey({ from: address })).map((v) => HashByte.toHash(v)).join('')

      const groupReencryptionKeyHash =
        (await group.getReencryptionKey({ from: address })).map((v) => HashByte.toHash(v)).join('')

      const memberPublicKeyHashStream = await window.ipfs.get(memberPublicKeyHash)
      const groupPrivateKeyHashStream = await window.ipfs.get(groupPrivateKeyHash)
      const groupReencryptionKeyHashStream = await window.ipfs.get(groupReencryptionKeyHash)

      let files = []
      memberPublicKeyHashStream.pipe(through.obj((file, enc, next) => {
        file.content.pipe(concat((content) => {
          files.push({
            path: file.path,
            content: content
          })
          next()
        }))
      }, () =>
      groupPrivateKeyHashStream.pipe(through.obj((file, enc, next) => {
        file.content.pipe(concat((content) => {
          files.push({
            path: file.path,
            content: content
          })
          next()
        }))
      }, () =>
      groupReencryptionKeyHashStream.pipe(through.obj((file, enc, next) => {
        file.content.pipe(concat((content) => {
          files.push({
            path: file.path,
            content: content
          })
          next()
        }))
      }, async function() {
        const [ memberPublicKey, groupPrivateKey, groupReencryptionKey, ...rest ] =
          files.map((f) => f.content.toString())

        const { body: { reencrypted: groupPrivateKeyReencrypt } } = await request
          .post('http://localhost:7000/encryption/reencrypt')
          .send({ publicKey: groupReencryptionKey, data: groupPrivateKey })
        const { body: { decrypted: groupPrivateKey_ } } = await request
          .post('http://localhost:7000/encryption/decrypt/first')
          .send({ secretKey, data: groupPrivateKeyReencrypt })
        const { body: { reencryptionKey }} = await request
          .post('http://localhost:7000/key/generate/reencryption')
          .send({ secretKey: groupPrivateKey_, publicKey: memberPublicKey })

        const [ { hash }, ..._ ] = await window.ipfs.add([{
          path: 'reencryptionKey',
          content: new Buffer(reencryptionKey)
        }])

        await group.addReencryptionKey(member, hash.slice(0, 32), hash.slice(32), { from: address })

        dispatch(groupAddReencryptionKeySuccess(address, contract, member))
      }))))))
    } catch (err) {
      dispatch(groupAddReencryptionKeyError(address, contract, member, err))
    }
  }
}

export const groupAddReencryptionKeyPending = (identity, group, member) => ({
  type: GROUP_ADD_REENCRYPTION_KEY_PENDING,
  identity,
  group,
  member
})

export const groupAddReencryptionKeySuccess = (identity, group, member) => ({
  type: GROUP_ADD_REENCRYPTION_KEY_SUCCESS,
  identity,
  group,
  member
})

export const groupAddReencryptionKeyError = (identity, group, member, error) => ({
  type: GROUP_ADD_REENCRYPTION_KEY_ERROR,
  identity,
  group,
  member,
  error
})
