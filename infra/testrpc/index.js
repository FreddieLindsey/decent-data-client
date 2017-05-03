import fs from 'fs'
import path from 'path'
import TestRPC from 'ethereumjs-testrpc'
import forge from 'node-forge'
import util from 'ethereumjs-util'

import accounts from './accounts.json'

const accounts_location = path.resolve(__dirname, 'accounts')

const check = () => {
  console.log('CLEARING ACCOUNTS DATA')
  try {
    fs.statSync(accounts_location)
  } catch(err) {
    fs.mkdirSync(accounts_location)
  }
  rmdir(accounts_location, false)

  console.log('GENERATING NEW ACCOUNT DATA')
  for (const i in accounts) {
    const account = accounts[i]
    const name = (account.name || i) + '.ecdsa'
    const privateKeyFile = path.resolve(accounts_location, name)

    let secretKey = account.secretKey
    if (secretKey.indexOf('0x') === 0) secretKey = secretKey.slice(2)

    fs.writeFileSync(privateKeyFile, secretKey)
  }
}

const rmdir = (directory, remove = true) => {
  let files
  try {
    files = fs.readdirSync(directory)
  } catch(e) {
    return
  }
  if (files.length > 0)
    for (const i in files) {
      const path_ = path.resolve(directory, files[i])
      fs.statSync(path_).isFile() ?
        fs.unlinkSync(path_) :
        rmdir(path_)
    }
  remove && fs.rmdirSync(directory)
};

const opts = {
  accounts,
  logger: console
}

const server = TestRPC.server(opts)
const PORT = process.env.TESTRPC_PORT || 8545

check()
server.listen(PORT, (err, blockchain, done) => {
  if (err) console.log(err.toString())
  console.log('TESTRPC listening on port ' + PORT)
  if (done) done()
})
