import request from 'superagent'

import {
  groupSetKeypairPending,
  groupSetKeypairSuccess,
  groupSetKeypairError
} from '../'

// Add store
export const REGISTRY_CREATE_GROUP_PENDING = 'REGISTRY_CREATE_GROUP_PENDING'
export const REGISTRY_CREATE_GROUP_SUCCESS = 'REGISTRY_CREATE_GROUP_SUCCESS'
export const REGISTRY_CREATE_GROUP_ERROR = 'REGISTRY_CREATE_GROUP_ERROR'

export const registryCreateGroup = () => {
  return async function(dispatch, getState) {
    const { address } = getState().security
    dispatch(registryCreateGroupPending(address))
    try {
      const registry = await contracts.Registry.deployed()
      const group = await contracts.Group.new({
        from: address, gasPrice: 100000000000, gas: 4712388
      })
      await registry.addGroup(group.address, { from: address })
      dispatch(registryCreateGroupSuccess(address, group))
      dispatch(groupSetKeypairPending(address, group))
      const { body: { secretKey, publicKey } } = await request
        .post('http://localhost:7000/key/generate/secret')
        .send({})

      const { body: { encrypted: secretKeyEncrypted } } = await request
        .post('http://localhost:7000/encryption/encrypt/second')
        .send({ publicKey, data: secretKey })

      window.ipfs.add([{ path: 'secretKey', content: new Buffer(secretKeyEncrypted) }],
      async function(err, res) {
        if (err) {
          dispatch(groupSetKeypairError(address, group, err))
          return
        }

        const hash = res[0].hash
        try {
          await group.setPrivateKey(hash.slice(0, 32), hash.slice(32, 64), {
            from: address, gas: 3000000, gasPrice: 10000000
          })
          dispatch(groupSetKeypairSuccess(address, group))
        } catch (err) {
          dispatch(groupSetKeypairError(address, group, err))
        }
      })
      window.ipfs.add([{ path: 'publicKey', content: new Buffer(publicKey) }],
      async function(err, res) {
        if (err) {
          dispatch(groupSetKeypairError(address, group, err))
          return
        }

        const hash = res[0].hash
        try {
          await group.setPublicKey(hash.slice(0, 32), hash.slice(32, 64), {
            from: address, gas: 3000000, gasPrice: 10000000
          })
          dispatch(groupSetKeypairSuccess(address, group))
        } catch (err) {
          dispatch(groupSetKeypairError(address, group, err))
        }
      })
    } catch (err) {
      dispatch(registryCreateGroupError(address, err))
    }
  }
}

export const registryCreateGroupPending = (identity) => ({
  type: REGISTRY_CREATE_GROUP_PENDING,
  identity
})

export const registryCreateGroupSuccess = (identity, group) => ({
  type: REGISTRY_CREATE_GROUP_SUCCESS,
  identity,
  group
})

export const registryCreateGroupError = (identity, error) => ({
  type: REGISTRY_CREATE_GROUP_ERROR,
  identity,
  error
})
