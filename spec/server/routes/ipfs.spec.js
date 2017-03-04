describe('IPFS', () => {

  it('get status', (done) => {
    request()
        .get('/ipfs')
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
  })

  it('send file', (done) => {
    request('localhost:8000')
        .post('/ipfs')
        .sendAsBinary(files.text)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.deep.equal({
            content: files.text.toString()
          })
          done()
        })
  })

})
