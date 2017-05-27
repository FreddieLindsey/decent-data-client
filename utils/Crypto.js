import forge from 'node-forge'

// Key represented as an int array
export const generateAESKey = () => forge.random.getBytesSync(16)

// IV represented as an int array
export const generateIv = () => forge.random.getBytesSync(8)

// Encrypt content using AES, IV inputs from above
export const encryptAES = (input, aes, iv) => {
  const inputBuffer = forge.util.createBuffer(input)

  let cipher = forge.cipher.createCipher('AES-CBC', aes)
  cipher.start({ iv })
  cipher.update(inputBuffer)
  cipher.finish()

  return cipher.output
}

// Decrypt content using AES input from above
export const decryptAES = (input, aes, iv) => {
  const inputBuffer = forge.util.createBuffer(input)

  let decipher = forge.cipher.createDecipher('AES-CBC', aes)
  decipher.start({ iv })
  decipher.update(inputBuffer)
  decipher.finish()

  return decipher.output
}

// Key should be a forge private key
export const decryptRSA = (ciphertext, key) => key.decrypt(ciphertext)

// Key should be a forge public key
export const encryptRSA = (unencrypted, key) => key.encrypt(unencrypted)
