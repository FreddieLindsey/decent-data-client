// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var fs = require('fs')
var path = require('path')

var accounts = fs.readFileSync(path.resolve(__dirname, 'infra', 'testrpc', 'accounts.json'))
var arbitrator
for (var i = 0; i < accounts.length; i++) {
  if (accounts[i].name === 'arbitrator')
    arbitrator = accounts[i].address
}

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    docker: {
      host: 'testrpc',
      port: 8545,
      network_id: '*' // Match any network id
    }
  },
  mocha: {
    useColors: true
  },
  rpc: {
    from: arbitrator
  }
}
