import {
  LOAD_PRIVATE_KEY_PENDING,
  LOAD_PRIVATE_KEY_SUCCESS,
  LOAD_PRIVATE_KEY_ERROR,
  LOAD_PUBLIC_KEY_PENDING,
  LOAD_PUBLIC_KEY_SUCCESS,
  LOAD_PUBLIC_KEY_ERROR
} from '../actions'

const initialState = {
  privateKey: null,
  publicKey: null,
  error: null
}

export const security = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PRIVATE_KEY_SUCCESS:
      return handleLoadPrivateKeySuccess(state, action.privateKey)
    case LOAD_PRIVATE_KEY_ERROR:
      return handleLoadPrivateKeyError(state, action.error)
    case LOAD_PUBLIC_KEY_SUCCESS:
      return handleLoadPublicKeySuccess(state, action.publicKey)
    case LOAD_PUBLIC_KEY_ERROR:
      return handleLoadPublicKeyError(state, action.error)
  }
  return state
}

const handleLoadPrivateKeySuccess = (state, privateKey) => {
  return {
    ...state,
    privateKey,
    error: null
  }
}

const handleLoadPrivateKeyError = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleLoadPublicKeySuccess = (state, publicKey) => {
  return {
    ...state,
    publicKey,
    error: null
  }
}

const handleLoadPublicKeyError = (state, error) => {
  return {
    ...state,
    error
  }
}
