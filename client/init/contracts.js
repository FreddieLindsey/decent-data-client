import contract from 'truffle-contract'

import IPFSStorage from '../../contracts/IPFSStorage.sol'

export const contractArtifacts = {
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
