import { validateKey } from '../../utils'

// Load secure key
export const LOAD_SECURE_KEY_PENDING = 'LOAD_SECURE_KEY_PENDING'
export const LOAD_SECURE_KEY_SUCCESS = 'LOAD_SECURE_KEY_SUCCESS'
export const LOAD_SECURE_KEY_ERROR = 'LOAD_SECURE_KEY_ERROR'

export const loadSecureKey = (key) => {
  return (dispatch) => {
    dispatch(loadSecureKeyPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let contents = f.target.result
      validateKey(contents, (error, key, type) => {
        if (error !== undefined) {
          dispatch(loadSecureKeyError(error))
        } else {
          dispatch(loadSecureKeySuccess(key, type))
        }
      })
    }
    reader.onerror = (error) => {
      dispatch(loadSecureKeyError(error))
    }
    reader.readAsText(key[0])
  }
}

const loadSecureKeyPending = () => {
  return {
    type: LOAD_SECURE_KEY_PENDING
  }
}

const loadSecureKeySuccess = (securekey, type) => {
  return {
    type: LOAD_SECURE_KEY_SUCCESS,
    securekey,
    keytype: type
  }
}

const loadSecureKeyError = (error) => {
  return {
    type: LOAD_SECURE_KEY_ERROR,
    error
  }
}
