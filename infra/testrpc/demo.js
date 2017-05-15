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
import Group from '../../build/contracts/Group.json'

const registry = contract(Registry)
const ipfsStorage = contract(IPFSStorage)
const group = contract(Group)

registry.setProvider(web3.currentProvider)
ipfsStorage.setProvider(web3.currentProvider)
group.setProvider(web3.currentProvider)

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
console.log()

// DEMO SCRIPT

let gmc_contract

register(['patient_1', 'patient_2', 'doctor'])
.then(createGMCContract)
.then(i => {
  gmc_contract = i
  attachDoctor(gmc_contract, accounts['doctor'].address)
})

// UTILITIES

async function register (registers) {
  return await Promise.all(registers.map((u) => register_(u, accounts)))
}

async function createGMCContract() {
  return await group.new({ from: accounts['gmc'].address, gas: 3000000, gasPrice: 10000000 })
}

async function attachDoctor(gmc_contract, doctor) {
  return await
    gmc_contract.register(doctor, {
      from: accounts['gmc'].address, gas: 3000000, gasPrice: 10000000
    })
}
