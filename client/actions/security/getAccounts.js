// Get Accounts From Web3
export const GET_ACCOUNTS_PENDING = 'GET_ACCOUNTS_PENDING'
export const GET_ACCOUNTS_SUCCESS = 'GET_ACCOUNTS_SUCCESS'
export const GET_ACCOUNTS_ERROR = 'GET_ACCOUNTS_ERROR'

export const getAccounts = () => {
  return (dispatch) => {
    dispatch(getAccountsPending())
    window.web3.eth.getAccounts((err, result) => {
      err ?
        dispatch(getAccountsError(err)) :
        dispatch(getAccountsSuccess(result))
    })
  }
}

const getAccountsPending = () => {
  return {
    type: GET_ACCOUNTS_PENDING
  }
}

const getAccountsSuccess = (accounts) => {
  return {
    type: GET_ACCOUNTS_SUCCESS,
    accounts
  }
}

const getAccountsError = (error) => {
  return {
    type: GET_ACCOUNTS_ERROR,
    error
  }
}
