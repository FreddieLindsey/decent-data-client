import forge from 'node-forge'

const rsa = forge.pki.rsa

window.forge = forge
window.rsa = rsa

export const DecryptRSA = (ciphertext, key) => {
  console.log('DECRYPTING')
  return ciphertext
}

export const EncryptRSA = (unencrypted, key) => {
  console.log('ENCRYPTING')

  return unencrypted
}
