import { web3 } from './web3'

let addresses_ = []

web3.eth.getAccounts((err, accounts) => {
  if (err !== null || accounts.length === 0) {
    process.exit(err !== null ? 1 : 2)
  } else {
    addresses_ = accounts
  }
})

export const addresses = () => {
  return addresses_
}
