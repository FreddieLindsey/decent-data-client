import express from 'express'
import ipfsApi from 'ipfs-api'

const router = express.Router()
const ipfs_ = ipfsApi()

router.get('/', (req, res, next) => {
  res.json({ status: ok })
})

router.post('/', (req, res, next) => {
  console.dir(req)
})

export const ipfs = router
