describe('IPFS', () => {

  it('get status', (done) => {
    request()
        .get('/ipfs')
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
  })

  it('send json', (done) => {
    const data = {
      file: 'LOL'
    }
    request()
        .post('/ipfs')
        .send(data)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.deep.equal(data)
          done()
        })
  })

})
