// Change the current account selected
export const ACCOUNTS_CHANGE = 'ACCOUNTS_CHANGE'

export const accountsChange = (value) => {
  return {
    type: ACCOUNTS_CHANGE,
    value
  }
}
