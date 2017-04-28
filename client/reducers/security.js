import {
  LOAD_SECURE_KEY_PENDING,
  LOAD_SECURE_KEY_SUCCESS,
  LOAD_SECURE_KEY_ERROR
} from '../actions'

const initialState = {
  securekey: null,
  error: null
}

export const security = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SECURE_KEY_SUCCESS:
      return handleLoadSecureKeySuccess(state, action.securekey)
    case LOAD_SECURE_KEY_ERROR:
      return handleLoadSecureKeyError(state, action.error)
  }
  return state
}

const handleLoadSecureKeySuccess = (state, securekey) => {
  return {
    ...state,
    securekey,
    error: null
  }
}

const handleLoadSecureKeyError = (state, error) => {
  return {
    ...state,
    error
  }
}
