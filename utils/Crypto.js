// Uses 2048-bit key
const chunkEnc = 256
const chunkDec = chunkEnc - 11

// Key should be a forge private key
export const DecryptRSA = (ciphertext, key) => {
  let result = ''
  for (let i = 0; i < ciphertext.length; i += chunkEnc) {
    result += key.decrypt(ciphertext.slice(i, i + chunkEnc))
  }
  return result
}

// Key should be a forge public key
export const EncryptRSA = (unencrypted, key) => {
  let result = ''
  for (let i = 0; i < unencrypted.length; i += chunkDec) {
    result += key.encrypt(unencrypted.slice(i, i + chunkDec))
  }
  return result
}
