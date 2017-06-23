import {
  SELECT_ACCOUNT,
  // LOAD_ENCRYPTION_KEYS_PENDING,
  LOAD_ENCRYPTION_KEYS_SUCCESS,
  LOAD_ENCRYPTION_KEYS_ERROR,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_ERROR
} from '../actions'

const initialState = {
  accounts: [],
  address: null,
  encryption: {
    secretKey: null,
    publicKey: null,
    error: null,
  }
}

export const security = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ENCRYPTION_KEYS_SUCCESS:
      return { ...state, encryption: { secretKey: action.secretKey, publicKey: action.publicKey } }
    case LOAD_ENCRYPTION_KEYS_ERROR:
      return { ...state, encryption: { ...state.encryption, error: action.error } }
    case SELECT_ACCOUNT:
      return { ...state, address: action.address, encryption: { ...initialState.encryption } }
    case GET_ACCOUNTS_SUCCESS:
      return { ...state, address: state.address || action.accounts[0], accounts: action.accounts }
  }
  return state
}
