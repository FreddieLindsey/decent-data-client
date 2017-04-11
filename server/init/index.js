import { web3 } from './web3'
import { contractArtifacts, initialise } from './contracts'

export const contracts = initialise(contractArtifacts, web3)
export { addresses } from './addresses'
