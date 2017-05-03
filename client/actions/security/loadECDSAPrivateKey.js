import {
  validateECDSAPrivateKey
} from '../../../utils'

// Load private key
export const LOAD_ECDSA_PRIVATE_KEY_PENDING = 'LOAD_ECDSA_PRIVATE_KEY_PENDING'
export const LOAD_ECDSA_PRIVATE_KEY_SUCCESS = 'LOAD_ECDSA_PRIVATE_KEY_SUCCESS'
export const LOAD_ECDSA_PRIVATE_KEY_ERROR = 'LOAD_ECDSA_PRIVATE_KEY_ERROR'

export const loadECDSAPrivateKey = (key) => {
  return (dispatch) => {
    dispatch(loadECDSAPrivateKeyPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let contents = f.target.result
      validateECDSAPrivateKey(contents, (error, privateKey, publicKey, ethereumAddress) => {
        if (error !== undefined) {
          dispatch(loadECDSAPrivateKeyError(error))
        } else {
          dispatch(loadECDSAPrivateKeySuccess(privateKey, publicKey, ethereumAddress))
        }
      })
    }
    reader.onerror = (error) => {
      dispatch(loadECDSAPrivateKeyError(error))
    }
    reader.readAsText(key[0])
  }
}

const loadECDSAPrivateKeyPending = () => {
  return {
    type: LOAD_ECDSA_PRIVATE_KEY_PENDING
  }
}

const loadECDSAPrivateKeySuccess = (privateKey, publicKey, address) => {
  return {
    type: LOAD_ECDSA_PRIVATE_KEY_SUCCESS,
    address,
    privateKey,
    publicKey
  }
}

const loadECDSAPrivateKeyError = (error) => {
  return {
    type: LOAD_ECDSA_PRIVATE_KEY_ERROR,
    error
  }
}
