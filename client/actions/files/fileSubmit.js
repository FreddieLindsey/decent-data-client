import Request from 'superagent'

import { EncryptRSA } from '../../../utils'

// Submitting files to IPFS
export const FILE_SUBMIT_PENDING = 'FILE_SUBMIT_PENDING'
export const FILE_SUBMIT_SUCCESS = 'FILE_SUBMIT_SUCCESS'
export const FILE_SUBMIT_ERROR   = 'FILE_SUBMIT_ERROR'

export const filesSubmit = (address = undefined) => {
  return (dispatch, getState) => {
    const identity = address || getState().security.address
    const index = getState().files.loaded
    for (const k in index) {
      dispatch(fileSubmit(index[k], k, identity))
    }
  }
}

const fileSubmit = (file, path, address) => {
  return (dispatch, getState) => {
    let content = EncryptRSA(file.content, getState().security.rsa.publicKey)

    dispatch(fileSubmitPending(path))
    window.ipfs.add([{
      path,
      content
    }], (err, res) => {
      if (err) {
        dispatch(fileSubmitError(address, path, err))
        return
      }

      const hash = res[0].hash
      const storage = getState().IPFSStorage.identities[address].address
      contracts.IPFSStorage.at(storage)
      .add(path, hash.slice(0, 32), hash.slice(32, 64),
        { from: getState().security.address,
          gas: 3000000, gasPrice: 10000000 })
      .then(() => dispatch(fileSubmitSuccess(address, path)))
      .catch((err) => dispatch(fileSubmitError(address, path, err)))
    })
  }
}

const fileSubmitPending = (address, path) => {
  return {
    type: FILE_SUBMIT_PENDING,
    address,
    path
  }
}

const fileSubmitSuccess = (address, path) => {
  return {
    type: FILE_SUBMIT_SUCCESS,
    address,
    path
  }
}

const fileSubmitError = (address, path, error) => {
  return {
    type: FILE_SUBMIT_ERROR,
    address,
    path,
    error
  }
}
