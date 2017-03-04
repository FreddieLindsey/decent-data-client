import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)

import server from '../../../server'

describe('IPFS', () => {

  it('get status', () => {
    chai.request(server)
        .get('/ipfs')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.deepEqual({
            status: 'ok'
          })
          done()
        })
  })

})
