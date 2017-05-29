import {
  LOGOUT,
  LOAD_ECDSA_PRIVATE_KEY_PENDING,
  LOAD_ECDSA_PRIVATE_KEY_SUCCESS,
  LOAD_ECDSA_PRIVATE_KEY_ERROR,
  LOAD_RSA_PRIVATE_KEY_PENDING,
  LOAD_RSA_PRIVATE_KEY_SUCCESS,
  LOAD_RSA_PRIVATE_KEY_ERROR,
  ACCOUNTS_CHANGE,
} from '../actions'

const initialState = {
  address: null,
  rsa: {
    privateKey: null,
    publicKey: null
  },
  ecdsa: {
    privateKey: null,
    publicKey: null
  },
  error: null
}

export const security = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...initialState }
    case LOAD_ECDSA_PRIVATE_KEY_SUCCESS:
      const { address, privateKey, publicKey } = action
      return handleLoadECDSAPrivateKeySuccess(state, privateKey, publicKey, address)
    case LOAD_ECDSA_PRIVATE_KEY_ERROR:
      return handleLoadECDSAPrivateKeyError(state, action.error)
    case LOAD_RSA_PRIVATE_KEY_SUCCESS:
      return handleLoadRSAPrivateKeySuccess(state, action.privateKey, action.publicKey)
    case LOAD_RSA_PRIVATE_KEY_ERROR:
      return handleLoadRSAPrivateKeyError(state, action.error)
    case ACCOUNTS_CHANGE:
      return handleAccountsChange(state)
  }
  return state
}

const handleLoadECDSAPrivateKeySuccess = (state, privateKey, publicKey, address) => {
  return {
    ...state,
    address,
    ecdsa: {
      privateKey,
      publicKey
    },
    error: null
  }
}

const handleLoadECDSAPrivateKeyError = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleLoadRSAPrivateKeySuccess = (state, privateKey, publicKey) => {
  return {
    ...state,
    rsa: {
      privateKey,
      publicKey
    },
    error: null
  }
}

const handleLoadRSAPrivateKeyError = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleAccountsChange = (state) => {
  return {
    ...state,
    privateKey: null,
    publicKey: null
  }
}
