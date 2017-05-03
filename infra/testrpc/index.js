import TestRPC from 'ethereumjs-testrpc'
import accounts from './accounts.json'

const opts = {
  accounts,
  logger: console
}

const server = TestRPC.server(opts)
const PORT = process.env.TESTRPC_PORT || 8545

server.listen(PORT, (err, blockchain) => {
  if (err) console.log(err.toString())
  console.log('TESTRPC listening on port ' + PORT)
})
