import {
  ACCOUNTS_INIT_PENDING,
  ACCOUNTS_INIT_SUCCESS,
  ACCOUNTS_INIT_ERROR
} from '../actions'

export const accounts = (state = {}, action) => {
  switch (action.type) {
    case ACCOUNTS_INIT_SUCCESS:
      return handleAccountsInitSuccess(state, action.accounts)
    case ACCOUNTS_INIT_ERROR:
      return handleAccountsInitError(state, action.error)
  }
  return state
}

// Accounts has to have at least one value
const handleAccountsInitSuccess = (state, accounts) => {
  return {
    ...state,
    accounts: {
      ...state.accounts,
      all: accounts,
      default: accounts[0]
    }
  }
}

const handleAccountsInitError = (state, error) => {
  return {
    ...state,
    accounts: {
      ...state.accounts,
      error
    }
  }
}
