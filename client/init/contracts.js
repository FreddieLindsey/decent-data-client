import contract from 'truffle-contract'

import Registry from '../../contracts/Registry.sol'
import IPFSStorage from '../../contracts/IPFSStorage.sol'
import Group from '../../contracts/Group.sol'

export const contractArtifacts = {
  Registry,
  Group,
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
