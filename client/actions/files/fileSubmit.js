import Request from 'superagent'

import { EncryptRSA } from '../../../utils'

// Submitting files to IPFS
export const FILE_SUBMIT_PENDING = 'FILE_SUBMIT_PENDING'
export const FILE_SUBMIT_SUCCESS = 'FILE_SUBMIT_SUCCESS'
export const FILE_SUBMIT_ERROR   = 'FILE_SUBMIT_ERROR'

export const filesSubmit = () => {
  return (dispatch, getState) => {
    const index = getState().files.loaded
    for (const k in index) {
      dispatch(fileSubmit(index[k], k))
    }
  }
}

const fileSubmit = (file, path, address = undefined) => {
  return (dispatch, getState) => {
    let content = EncryptRSA(file.content, getState().security.rsa.publicKey)

    dispatch(fileSubmitPending(path))
    window.ipfs.add([{
      path,
      content
    }], (err, res) => {
      if (err) {
        dispatch(fileSubmitError(path, err))
        return
      }

      const hash = res[0].hash
      const storage = address || getState().IPFSStorage.mine
      contracts.IPFSStorage.at(storage)
      .add(path, hash.slice(0, 32), hash.slice(32, 64),
        { from: getState().security.address,
          gas: 3000000, gasPrice: 10000000 })
      .then(() => dispatch(fileSubmitSuccess(path)))
      .catch((err) => dispatch(fileSubmitError(path, err)))
    })
  }
}

const fileSubmitPending = (path) => {
  return {
    type: FILE_SUBMIT_PENDING,
    path
  }
}

const fileSubmitSuccess = (path) => {
  return {
    type: FILE_SUBMIT_SUCCESS,
    path
  }
}

const fileSubmitError = (path, error) => {
  return {
    type: FILE_SUBMIT_ERROR,
    path,
    error
  }
}
