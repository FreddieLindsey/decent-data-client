// Select account from Web3
export const SELECT_ACCOUNT = 'SELECT_ACCOUNT'

export const selectAccount = (address) => ({
  type: SELECT_ACCOUNT,
  address
})
