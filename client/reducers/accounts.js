import {
  ACCOUNTS_INIT_PENDING,
  ACCOUNTS_INIT_SUCCESS,
  ACCOUNTS_INIT_ERROR,
} from '../actions'

const initialState = {
  all: [],
  error: null
}

const accounts = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNTS_INIT_SUCCESS:
      return handleAccountsInitSuccess(state, action.accounts)
    case ACCOUNTS_INIT_ERROR:
      return handleAccountsInitError(state, action.error)
  }
  return state
}

const handleAccountsInitSuccess = (state, accounts) => {
  return {
    ...state,
    all: accounts
  }
}

const handleAccountsInitError = (state, error) => {
  return {
    ...state,
    error
  }
}

export default accounts
