import {
  LOGOUT,
  // LOAD_ECDSA_PRIVATE_KEY_PENDING,
  LOAD_ECDSA_PRIVATE_KEY_SUCCESS,
  LOAD_ECDSA_PRIVATE_KEY_ERROR,
  // LOAD_ENCRYPTION_KEYS_PENDING,
  LOAD_ENCRYPTION_KEYS_SUCCESS,
  LOAD_ENCRYPTION_KEYS_ERROR,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_ERROR,
  ACCOUNTS_CHANGE,
} from '../actions'

const initialState = {
  accounts: [],
  address: null,
  encryption: {
    secretKey: null,
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
    case LOAD_ENCRYPTION_KEYS_SUCCESS:
      return handleLoadEncryptionKeysSuccess(state, action.secretKey, action.publicKey)
    case LOAD_ENCRYPTION_KEYS_ERROR:
      return handleLoadEncryptionKeysError(state, action.error)
    case GET_ACCOUNTS_SUCCESS:
      return handleGetAccounts(state, action.accounts)
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

const handleLoadEncryptionKeysSuccess = (state, secretKey, publicKey) => {
  return {
    ...state,
    encryption: {
      secretKey,
      publicKey
    },
    error: null
  }
}

const handleLoadEncryptionKeysError = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleGetAccounts = (state, accounts) => {
  return {
    ...state,
    accounts
  }
}

const handleAccountsChange = (state) => {
  return {
    ...state,
    encryption: {
      privateKey: null,
      publicKey: null
    },
    ecdsa: {
      privateKey: null,
      publicKey: null
    }
  }
}
