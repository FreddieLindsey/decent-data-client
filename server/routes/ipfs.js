import express from 'express'
import ipfsApi from 'ipfs-api'

const router = express.Router()
const host = process.env.IPFS_HOST || 'localhost'
const port = process.env.IPFS_PORT || 5001
const ipfs_ = ipfsApi(host, port)

router.get('/', (req, res, next) => {
  res.json({ status: 'ok' })
})

router.post('/', (req, res, next) => {
  res.json({ content: req.body.data })
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
