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

const fileSubmit = (file, path, encrypt = true) => {
  return (dispatch, getState) => {
    let content = !encrypt ?
      file.content :
      EncryptRSA(file.content, getState().security.securekey)

    dispatch(fileSubmitPending(path))
    Request
      .post(process.env.API_ENDPOINT + '/ipfs')
      .send({
        path,
        content
      })
      .end((err, res) => {
        if (err) {
          dispatch(fileSubmitError(path, err))
        } else {
          dispatch(fileSubmitSuccess(path))
        }
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
