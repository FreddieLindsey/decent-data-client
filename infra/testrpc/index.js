import fs from 'fs'
import path from 'path'
import TestRPC from 'ethereumjs-testrpc'
import request from 'superagent'

import accounts from './accounts.json'

const accounts_location = path.resolve(__dirname, 'accounts')

const check = () => {
  console.log('CLEARING ACCOUNTS DATA')
  try {
    fs.statSync(accounts_location)
  } catch(err) {
    fs.mkdirSync(accounts_location)
  }

  console.log('GENERATING NEW ACCOUNT DATA')
  for (const i in accounts) {
    const account = accounts[i]
    const ecdsa = (account.name || i) + '.ecdsa'
    const ECDSAPrivateKeyFile = path.resolve(accounts_location, ecdsa)

    let secretKey = account.secretKey
    if (secretKey.indexOf('0x') === 0) secretKey = secretKey.slice(2)

    fs.writeFileSync(ECDSAPrivateKeyFile, secretKey)

    const eKey = (account.name || i) + '.eKey'
    const eKeyFile = path.resolve(accounts_location, eKey)
    const makeEncryptionKeys = () => {
      request
        .post('http://localhost:7000/key/generate/secret')
        .then(({ body }) => {
          fs.writeFileSync(eKeyFile, JSON.stringify(body, null, 2))
        })
    }
    makeEncryptionKeys()
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
server.listen(PORT, (err, blockchain) => {
  if (err) console.log(err.toString())
  console.log('TESTRPC listening on port ' + PORT)
  console.log('\n\n')
  console.log('UNLOCKED ACCOUNTS AT INITIALISATION')

  let counter = 1
  for (const i in blockchain.unlocked_accounts)
    console.log(`${counter++}:\t${i}`)
  console.log('\n\n')
})
