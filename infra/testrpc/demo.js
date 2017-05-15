import fs from 'fs'
import path from 'path'
import forge from 'node-forge'
import ipfs_ from 'ipfs-api'
const ipfs = ipfs_()

import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

import contract from 'truffle-contract'
import Registry from '../../build/contracts/Registry.json'
import IPFSStorage from '../../build/contracts/IPFSStorage.json'

const registry = contract(Registry)
const ipfsStorage = contract(IPFSStorage)

registry.setProvider(web3.currentProvider)
ipfsStorage.setProvider(web3.currentProvider)

import {
  validateRSAPrivateKey
} from '../../utils'

let accounts = {}
require('./accounts.json').forEach((a) => {
  accounts[a.name] = {
    address: a.address,
    privateKey: a.secretKey
  }
})

const pad = (text, len) => {
  while (text.length < len)
    text = ' ' + text
  return text
}

console.log('ACCOUNTS LOADED:')
console.log()
for (const i in accounts)
  console.log(`${pad(i, 12)}:\t${accounts[i].address}`)

// Register patient_1 and patient_2
validateRSAPrivateKey(
  fs.readFileSync(path.resolve(__dirname, 'accounts', 'patient_1.rsa')), (_, s, p) => {
    const publicKeyPem = forge.pki.publicKeyToPem(p)
    ipfs.add([ { path: 'publicKey.pem', content: publicKeyPem }], (err, res) => {
      if (err) return
      const hash = res[0].hash
      ipfsStorage.new(hash.slice(0, 32), hash.slice(32, 64), {
        from: accounts['patient_1'].address, gas: 3000000, gasPrice: 10000000
      })
      .then((i) => {
        accounts['patient_1'].ipfsStorage = i.address
        return registry.deployed()
      })
      .then((i) => {
        return i.addStore(accounts['patient_1'].ipfsStorage, {
          from: accounts['patient_1'].address, gas: 3000000, gasPrice: 10000000
        })
      })
    })
  })
