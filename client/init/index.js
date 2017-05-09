// Import bootstrap dependencies
import './bootstrap'

import { contractArtifacts, initialise } from './contracts'
import { web3 } from './web3'
// import './ipfs'

window.web3 = web3
window.contracts = initialise(contractArtifacts, web3)

if (module.hot) {
  let { contractArtifacts } = require('./contracts')

  window.contracts = initialise(contractArtifacts, web3)
}
