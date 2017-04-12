import { web3 } from './web3'

let addresses_ = []

web3.eth.getAccounts((err, accounts) => {
  if (err !== null || accounts.length === 0) {
    process.exit(err !== null ? 1 : 2)
  } else {
    addresses_ = addresses_.concat(accounts)
  }
})

export const addresses = () => {
  return {
    all: addresses_,
    default: addresses_[0]
  }
}
