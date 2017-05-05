import accounts from '../infra/testrpc/accounts.json'

const IPFSStorage = artifacts.require('./IPFSStorage.sol')

let
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

export const IPFSStorageWithPublicKey = (account, publicKeyHash) => {
  if (!contractsIPFSStorage[account]) {
    let i
    contractsIPFSStorage[account] = {
      contract: IPFSStorage.new({ from: account }).then((instance) => {
        i = instance
        return instance.updatePublicKey(
          publicKeyHash.slice(0, 32), publicKeyHash.slice(32, 64), { from: account }
        )
      }),
      instance: () => i
    }
  }

  return contractsIPFSStorage[account]
}
