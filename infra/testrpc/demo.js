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

import register_ from './demo/register'

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

// DEMO SCRIPT

register(['patient_1', 'patient_2', 'doctor'])

// UTILITIES

async function register (registers) {
  return await Promise.all(registers.map((u) => register_(u, accounts)))
}
