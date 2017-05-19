// Import bootstrap dependencies
import './bootstrap'

import { contractArtifacts, initialise } from './contracts'
import { web3 } from './web3'

window.web3 = web3
window.contracts = initialise(contractArtifacts, web3)

if (module.hot) module.hot.accept('./contracts', () => {
  console.log('HOT RELOADING CONTRACTS')
  window.contracts = initialise(require('./contracts').contractArtifacts, web3)
})
