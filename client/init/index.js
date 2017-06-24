// Import package dependencies
import './bootstrap'
import './react-select'
import './toastr'

import { contractArtifacts, initialise } from './contracts'
import { web3 } from './web3'
import ipfsApi from 'ipfs-api'

window.onload = () => {
  window.ipfs = ipfsApi('localhost', 5001)
}

window.web3 = web3
window.contracts = initialise(contractArtifacts, web3)

if (module.hot) module.hot.accept('./contracts', () => {
  console.log('HOT RELOADING CONTRACTS')
  window.contracts = initialise(require('./contracts').contractArtifacts, web3)
})
