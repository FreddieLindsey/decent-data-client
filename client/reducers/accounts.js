import {
  ACCOUNTS_INIT_PENDING,
  ACCOUNTS_INIT_SUCCESS,
  ACCOUNTS_INIT_ERROR,
  ACCOUNTS_CHANGE,
} from '../actions'

const initialState = {
  all: [],
  default: null,
  error: null
}

const accounts = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNTS_INIT_SUCCESS:
      return handleAccountsInitSuccess(state, action.accounts)
    case ACCOUNTS_INIT_ERROR:
      return handleAccountsInitError(state, action.error)
    case ACCOUNTS_CHANGE:
      return handleAccountsChange(state, action.value)
  }
  return state
}

// Accounts has to have at least one value
const handleAccountsInitSuccess = (state, accounts) => {
  return {
    ...state,
    all: accounts,
    default: accounts[0]
  }
}

const handleAccountsInitError = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleAccountsChange = (state, value) => {
  if (state.all.find(e => e === value) === value)
    return {
      ...state,
      default: value
    }

  return {
    ...state,
    error: 'Account address given is not unlocked'
  }
}

export default accounts
