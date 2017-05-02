import forge from 'node-forge'

// APPLICATION REQUIRES ASYMMETRIC KEYS
// ALLOWED: RSA

const errorPrivate = (done, error = 'Error: not a suitable private key') => done(error)
const errorPublic  = (done, error = 'Error: not a suitable public key') => done(error)

export const validatePrivateKey = (contents, done) => {
  try {
    let privateKey = forge.pki.privateKeyFromPem(contents)
    let publicKey = forge.pki.rsa.setPublicKey(privateKey.n, privateKey.e)
    done(undefined, privateKey, publicKey)
  } catch (error) {
    errorPrivate(done, error)
  }
}

export const validatePublicKey = (contents, done) => {
  try {
    let key = forge.pki.publicKeyFromPem(contents)
    done(undefined, key)
  } catch (error) {
    errorPublic(done, error)
  }
}
