import {
  validateRSAPrivateKey
} from '../../../utils'

// Load private key
export const LOAD_RSA_PRIVATE_KEY_PENDING = 'LOAD_RSA_PRIVATE_KEY_PENDING'
export const LOAD_RSA_PRIVATE_KEY_SUCCESS = 'LOAD_RSA_PRIVATE_KEY_SUCCESS'
export const LOAD_RSA_PRIVATE_KEY_ERROR = 'LOAD_RSA_PRIVATE_KEY_ERROR'

export const loadRSAPrivateKey = (key) => {
  return (dispatch) => {
    dispatch(loadRSAPrivateKeyPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let contents = f.target.result
      validateRSAPrivateKey(contents, (error, privateKey, publicKey) => {
        if (error !== undefined) {
          dispatch(loadRSAPrivateKeyError(error))
        } else {
          dispatch(loadRSAPrivateKeySuccess(privateKey, publicKey))
        }
      })
    }
    reader.onerror = (error) => {
      dispatch(loadRSAPrivateKeyError(error))
    }
    reader.readAsText(key[0])
  }
}

const loadRSAPrivateKeyPending = () => {
  return {
    type: LOAD_RSA_PRIVATE_KEY_PENDING
  }
}

const loadRSAPrivateKeySuccess = (privateKey, publicKey) => {
  return {
    type: LOAD_RSA_PRIVATE_KEY_SUCCESS,
    privateKey,
    publicKey
  }
}

const loadRSAPrivateKeyError = (error) => {
  return {
    type: LOAD_RSA_PRIVATE_KEY_ERROR,
    error
  }
}
