import fs from 'fs'
import path from 'path'
import TestRPC from 'ethereumjs-testrpc'
import forge from 'node-forge'
import util from 'ethereumjs-util'

import accounts from './accounts.json'

const accounts_location = path.resolve(__dirname, 'accounts')

const opts = {
  accounts,
  logger: console
}

const server = TestRPC.server(opts)
const PORT = process.env.TESTRPC_PORT || 8545

const check = () => {
  try {
    fs.statSync(accounts_location)
    rmdir(accounts_location, false)
  } catch(err) {
    console.dir(err)
    fs.mkdirSync(accounts_location)
  }

  for (const i in accounts) {
    const account = accounts[i]
    const name = (account.name || i) + '.ecdsa'
    const privateKeyFile = path.resolve(accounts_location, name)

    let secretKey = account.secretKey
    if (secretKey.indexOf('0x') === 0) secretKey = secretKey.slice(2)

    fs.writeFileSync(privateKeyFile, secretKey)
  }
}

const rmdir = (dirPath, removeSelf = true) => {
  let files;
  try {
    files = fs.readdirSync(dirPath)
  } catch(e) {
    return
  }
  if (files.length > 0)
    for (const i in files) {
      const path_ = path.resolve(dirPath, files[i])
      if (fs.statSync(path_).isFile())
        fs.unlinkSync(path_);
      else
        rmdir(path_);
    }
  if (removeSelf)
    fs.rmdirSync(dirPath);
};

const mkdirp = (err, stats) => {
  err ?
    fs.mkdir(accounts_location, () => { serverStart() }) :
    removeFiles(() => { serverStart() })
}

const removeFiles = (done) => {

}

const serverStart = (done) => {
  server.listen(PORT, (err, blockchain, done) => {
    if (err) console.log(err.toString())
    console.log('TESTRPC listening on port ' + PORT)
    if (done) done()
  })
}

check()
