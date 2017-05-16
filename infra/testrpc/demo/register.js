import fs from 'fs'
import path from 'path'
import forge from 'node-forge'
import ipfs_ from 'ipfs-api'
const ipfs = ipfs_()

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

import contract from 'truffle-contract'
import Registry from '../../../build/contracts/Registry.json'
import IPFSStorage from '../../../build/contracts/IPFSStorage.json'

const registry = contract(Registry)
const ipfsStorage = contract(IPFSStorage)

registry.setProvider(web3.currentProvider)
ipfsStorage.setProvider(web3.currentProvider)

import {
  validateRSAPrivateKey
} from '../../../utils'

// Register a user
async function register (username, accounts) {
  return validateRSAPrivateKey(
    fs.readFileSync(path.resolve(__dirname, '..', 'accounts', `${username}.rsa`)), (_, s, p) => {
      let instance
      const publicKeyPem = forge.pki.publicKeyToPem(p)
      ipfs.add([ { path: 'publicKey.pem', content: publicKeyPem }], (err, res) => {
        if (err) return
        const hash = res[0].hash
        ipfsStorage.new(hash.slice(0, 32), hash.slice(32, 64), {
          from: accounts[username].address, gas: 3000000, gasPrice: 10000000
        })
        .then((i) => {
          accounts[username].ipfsStorage = i.address
          return registry.deployed()
        })
        .then((i) => {
          instance = i
          return instance.getStore(accounts[username].address)
        })
        .then(() => username)
        .catch((err) => {
          return instance.addStore(accounts[username].ipfsStorage, {
            from: accounts[username].address, gas: 3000000, gasPrice: 10000000
          })
        })
        .then(() => username)
      })
    })
}

export default register
