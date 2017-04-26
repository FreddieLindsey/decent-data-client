import express from 'express'
import ipfsApi from 'ipfs-api'

import concat from 'concat-stream'
import through from 'through2'

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

// Retrieve data from the system
router.get('/', (req, res, next) => {
  if (!req.query.path) {
    res.json({ connected: !!resolved })
    return
  }

  IPFSStorage.deployed()
  .then(i => {
    return i.getHash(req.query.path)
  })
  .then(hashArray => {
    let hash = HashByte.toHash(hashArray[0]) + HashByte.toHash(hashArray[1])
    ipfs_.get(hash, (err, stream) => {
      if (err) {
        res.status(400)
        res.json({ error: err.toString() })
        return
      }

      let files = []
      stream.pipe(through.obj((file, enc, next) => {
        file.content.pipe(concat((content) => {
          files.push({
            path: file.path,
            content: content
          })
          next()
        }))
      }, () => {
        if (files.length !== 1 || files[0].path !== hash) {
          res.status(500)
          res.json({ error: 'Unknown error' })
        }
        res.send(files[0].content)
      }))
    })
  })
  .catch(err => {
    res.status(500)
    res.json({ error: err.toString() })
  })
})

// Push data into the system
router.post('/', (req, res, next) => {
  let content = new Buffer(req.body.content)
  ipfs_.add([{
    path: req.body.path,
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
      return i.add(
        path, hash.slice(0, 32), hash.slice(32, 64),
        { from: resolved.all[0], gas: 3000000 }
      )
    })
    .then((receipt) => {
      let added = resp[0]
      res.json({ receipt, path: added.path, size: added.size })
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
