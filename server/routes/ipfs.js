import express from 'express'
import ipfsApi from 'ipfs-api'

import { addresses, contracts } from '../init'
import { Pad, HashByte } from '../../utils'

const {
  IPFSStorage
} = contracts

const router = express.Router()
const host = process.env.IPFS_HOST || 'localhost'
const port = process.env.IPFS_PORT || 5001
const ipfs_ = ipfsApi(host, port)

let resolved
setTimeout(() => { resolved = addresses(); }, 1000);

// For status of router
router.get('/', (req, res, next) => {
  res.json({ status: 'ok' })
})

router.post('/', (req, res, next) => {
  let content = new Buffer(req.body.content)
  ipfs_.add([{
    path: req.body.name,
    content
  }], (err, resp) => {
    if (err) {
      res.status(400)
      res.json({ error: err.toString() })
      return
    }

    const {
      path,
      hash
    } = resp[0]

    IPFSStorage.deployed()
    .then(i => {
      const hashPad = Pad.pad(hash, 64)
      return i.add(path, hashPad.slice(0, 32), hashPad.slice(32, 64), { from: resolved.all[0] })
    })
    .then((receipt) => {
      res.json({ receipt, additions: resp })
    })
    .catch(err => {
      res.status(500)
      res.json({ error: err.toString() })
    })
  })
})

const showIpfsConfig = () => {
  console.log('Connected to IPFS')
  ipfs_.id().then((instance) => {
    console.log('--- --- --- --- --- --- --- ---')
    console.log('IPFS CONFIGURATION:')
    console.log()

    // Show addresses
    console.log('ADDRESSES:')
    for (const i in instance.addresses) {
      let aCs = instance.addresses[i].split('/')
      aCs = aCs.splice(0, aCs.length - 2)
      console.log('\t' + aCs.join('/'))
    }

    // Protocols
    console.log()
    console.log('ID:\t\t\t' + instance.id)
    console.log('AGENT VERSION:\t\t' + instance.agentVersion)
    console.log('PROTOCOL VERSION:\t' + instance.protocolVersion)

    console.log('\nIPFS READY!')
    console.log('--- --- --- --- --- --- --- ---')
  })
}

if (process.env.NODE_ENV === 'development') showIpfsConfig()

export const ipfs = router
