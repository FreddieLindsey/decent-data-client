import forge from 'node-forge'
import { ec } from 'elliptic'
import secp256k1 from 'secp256k1'
import keccak from 'keccak'

const ecdsa = ec('secp256k1')

// APPLICATION REQUIRES ASYMMETRIC KEYS
// ALLOWED: RSA

export const validateRSAPrivateKey = (contents, done) => {
  try {
    let privateKey = forge.pki.privateKeyFromPem(contents)
    let publicKey = forge.pki.rsa.setPublicKey(privateKey.n, privateKey.e)
    done(undefined, privateKey, publicKey)
  } catch (error) {
    done(error)
  }
}

export const validateECDSAPrivateKey = (contents, done) => {
  const hex = contents.indexOf('0x') === 0 ?
    contents.slice(2) : contents
  const { priv } = ecdsa.keyFromPrivate(hex, 'hex')
  const privateKey = Buffer.from(priv.toArray())
  const valid = secp256k1.privateKeyVerify(privateKey)
  if (valid) {
    const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1)
    done(
      undefined,
      '0x'+ privateKey.toString('hex'), '0x'+ pub.toString('hex'),
      determineEthereumAddress(pub))
  } else {
    done('Error: Provided key is not a valid ECDSA private key')
  }
}

const determineEthereumAddress = (publicKey) => {
  const hash = keccak('keccak256')
  hash.update(publicKey)
  return '0x' + hash.digest().slice(-20).toString('hex')
}
