import contract from 'truffle-contract'

import Registry from '../../build/contracts/Registry.json'
import IPFSStorage from '../../build/contracts/IPFSStorage.json'

export const contractArtifacts = {
  Registry,
  IPFSStorage
}

export const initialise = (contractArtifacts, web3) => {
  let contracts = {};
  for (const k in contractArtifacts) {
    const contract_ = contract(contractArtifacts[k])
    contract_.setProvider(web3.currentProvider)
    contracts[k] = contract_
  }
  return contracts
}
