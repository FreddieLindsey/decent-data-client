import {
  validatePrivateKey,
  validatePublicKey
} from '../../utils'

// Load private key
export const LOAD_PRIVATE_KEY_PENDING = 'LOAD_PRIVATE_KEY_PENDING'
export const LOAD_PRIVATE_KEY_SUCCESS = 'LOAD_PRIVATE_KEY_SUCCESS'
export const LOAD_PRIVATE_KEY_ERROR = 'LOAD_PRIVATE_KEY_ERROR'

export const loadPrivateKey = (key) => {
  return (dispatch) => {
    dispatch(loadPrivateKeyPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let contents = f.target.result
      validatePrivateKey(contents, (error, privateKey) => {
        if (error !== undefined) {
          dispatch(loadPrivateKeyError(error))
        } else {
          dispatch(loadPrivateKeySuccess(privateKey))
        }
      })
    }
    reader.onerror = (error) => {
      dispatch(loadPrivateKeyError(error))
    }
    reader.readAsText(key[0])
  }
}

const loadPrivateKeyPending = () => {
  return {
    type: LOAD_PRIVATE_KEY_PENDING
  }
}

const loadPrivateKeySuccess = (privateKey) => {
  return {
    type: LOAD_PRIVATE_KEY_SUCCESS,
    privateKey
  }
}

const loadPrivateKeyError = (error) => {
  return {
    type: LOAD_PRIVATE_KEY_ERROR,
    error
  }
}

// Load public key
export const LOAD_PUBLIC_KEY_PENDING = 'LOAD_PUBLIC_KEY_PENDING'
export const LOAD_PUBLIC_KEY_SUCCESS = 'LOAD_PUBLIC_KEY_SUCCESS'
export const LOAD_PUBLIC_KEY_ERROR = 'LOAD_PUBLIC_KEY_ERROR'

export const loadPublicKey = (key) => {
  return (dispatch) => {
    dispatch(loadPublicKeyPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let contents = f.target.result
      validatePublicKey(contents, (error, publicKey) => {
        if (error !== undefined) {
          dispatch(loadPublicKeyError(error))
        } else {
          dispatch(loadPublicKeySuccess(publicKey))
        }
      })
    }
    reader.onerror = (error) => {
      dispatch(loadPublicKeyError(error))
    }
    reader.readAsText(key[0])
  }
}

const loadPublicKeyPending = () => {
  return {
    type: LOAD_PUBLIC_KEY_PENDING
  }
}

const loadPublicKeySuccess = (publicKey) => {
  return {
    type: LOAD_PUBLIC_KEY_SUCCESS,
    publicKey
  }
}

const loadPublicKeyError = (error) => {
  return {
    type: LOAD_PUBLIC_KEY_ERROR,
    error
  }
}
