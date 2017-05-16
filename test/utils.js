import accounts_ from '../infra/testrpc/accounts.json'

const Registry = artifacts.require('./Registry.sol')
const IPFSStorage = artifacts.require('./IPFSStorage.sol')
const Group = artifacts.require('./Group.sol')

let
  contractRegistry = {},
  contractsIPFSStorage = {},
  contractsGroup = {}

export const isThrow = (err) => {
  return err.toString().indexOf('invalid JUMP') !== -1
}

let accountsData = { init: false, data: {} }
export const accounts = (name) => {
  if (!accountsData.init)
    for (const i in accounts_)
      accountsData.data[accounts_[i].name] = accounts_[i]

  return accountsData.data[name]
}

export const IPFSStorageWithPublicKey = (account, publicKeyHash = undefined,
                                         refresh = false) => {
  if ((!contractsIPFSStorage[account] || refresh) && publicKeyHash) {
    let i
    contractsIPFSStorage[account] = {
      contract:
        IPFSStorage.new(publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account })
        .then((instance) => {
          i = instance
          return
        }),
      instance: () => i
    }
  }

  return contractsIPFSStorage[account]
}

export const RegistryBlank = (refresh = false) => {
  if (refresh || !contractRegistry.contract) {
    let i
    contractRegistry = {
      contract:
        Registry.new({ from: accounts('arbitrator').address })
        .then((instance) => { i = instance }),
      instance: () => i
    }
  }
  return contractRegistry
}
