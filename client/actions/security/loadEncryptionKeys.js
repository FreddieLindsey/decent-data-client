// Load private key
export const LOAD_ENCRYPTION_KEYS_PENDING = 'LOAD_ENCRYPTION_KEYS_PENDING'
export const LOAD_ENCRYPTION_KEYS_SUCCESS = 'LOAD_ENCRYPTION_KEYS_SUCCESS'
export const LOAD_ENCRYPTION_KEYS_ERROR = 'LOAD_ENCRYPTION_KEYS_ERROR'

export const loadEncryptionKeys = (key) => {
  return (dispatch) => {
    dispatch(loadEncryptionKeysPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let content = f.target.result
      try {
        const json = JSON.parse(content)
        if (!(json.secretKey && json.publicKey))
          throw new Error('Must contain secretKey and publicKey')
        const { secretKey, publicKey } = json
        dispatch(loadEncryptionKeysSuccess(secretKey, publicKey))
      } catch (err) {
        dispatch(loadEncryptionKeysError(err))
      }
    }
    reader.onerror = (error) => {
      dispatch(loadEncryptionKeysError(error))
    }
    reader.readAsText(key[0])
  }
}

const loadEncryptionKeysPending = () => {
  return {
    type: LOAD_ENCRYPTION_KEYS_PENDING
  }
}

const loadEncryptionKeysSuccess = (secretKey, publicKey) => {
  return {
    type: LOAD_ENCRYPTION_KEYS_SUCCESS,
    secretKey,
    publicKey
  }
}

const loadEncryptionKeysError = (error) => {
  return {
    type: LOAD_ENCRYPTION_KEYS_ERROR,
    error
  }
}
