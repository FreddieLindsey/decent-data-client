// Unlock account from Web3
export const UNLOCK_ACCOUNT_PENDING = 'UNLOCK_ACCOUNT_PENDING'
export const UNLOCK_ACCOUNT_SUCCESS = 'UNLOCK_ACCOUNT_SUCCESS'
export const UNLOCK_ACCOUNT_ERROR = 'UNLOCK_ACCOUNT_ERROR'

export const unlockAccount = (address, privateKey) => {
  return (dispatch) => {
    dispatch(unlockAccountPending())
    window.web3.eth.unlockAccount(address, privateKey, (err, result) => {
      err ?
        dispatch(unlockAccountError(err)) :
        dispatch(unlockAccountSuccess(result))
    })
  }
}

const unlockAccountPending = () => {
  return {
    type: UNLOCK_ACCOUNT_PENDING
  }
}

const unlockAccountSuccess = (accounts) => {
  return {
    type: UNLOCK_ACCOUNT_SUCCESS,
    accounts
  }
}

const unlockAccountError = (error) => {
  return {
    type: UNLOCK_ACCOUNT_ERROR,
    error
  }
}
