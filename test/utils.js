import accounts_ from '../infra/testrpc/accounts.json'

const Registry_ = artifacts.require('Registry')
const IPFSStorage_ = artifacts.require('IPFSStorage')
const Group_ = artifacts.require('Group')

let
  contractRegistry = {},
  contractsIPFSStorage = {},
  contractGroup = {}

let accountsData = { init: false, data: {} }
export const accounts = (name) => {
  if (!accountsData.init)
    for (const i in accounts_)
      accountsData.data[accounts_[i].name] = accounts_[i]

  return accountsData.data[name]
}

export const IPFSStorage = (account, publicKeyHash = undefined,
                                         refresh = false) => {
  if ((!contractsIPFSStorage[account] || refresh) && publicKeyHash) {
    let i
    contractsIPFSStorage[account] = {
      contract:
        IPFSStorage_.new(publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account })
        .then((instance) => {
          i = instance
          return
        }),
      instance: () => i
    }
  }

  return contractsIPFSStorage[account]
}

export const Registry = (refresh = false) => {
  if (refresh || !contractRegistry.contract) {
    let i
    contractRegistry = {
      contract:
        Registry_.new({ from: accounts('arbitrator').address })
        .then((instance) => { i = instance }),
      instance: () => i
    }
  }
  return contractRegistry
}

export const Group = (account, refresh = false) => {
  if (refresh || !contractGroup.contract) {
    let i
    contractGroup = {
      contract:
        Group_.new({ from: account })
        .then((instance) => { i = instance }),
      instance: () => i
    }
  }
  return contractGroup
}
