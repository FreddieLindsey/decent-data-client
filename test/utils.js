import accounts from '../infra/testrpc/accounts.json'

const Registry = artifacts.require('./Registry.sol')
const IPFSStorage = artifacts.require('./IPFSStorage.sol')

let
  contractRegistry = {},
  contractsIPFSStorage = {}

export const isThrow = (err) => {
  return err.toString().indexOf('invalid JUMP') !== -1
}

export const findAccount = (name) => {
  for (const i in accounts)
    if (accounts[i].name === name)
      return accounts[i]
  console.log(`No account found with name ${name}`)
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
        Registry.new({ from: findAccount('arbitrator').address })
        .then((instance) => { i = instance }),
      instance: () => i
    }
  }
  return contractRegistry
}
