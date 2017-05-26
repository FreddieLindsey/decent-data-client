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
export const DecryptRSA = (ciphertext, RSAKey) => {
  const text = ciphertext.toString()

  // Get data
  const AESKeyEncrypted = text.slice(0, 256)
  const encryptedBytes = text.slice(256)

  // Decrypt key
  const AESKeyPadded = RSAKey.decrypt(AESKeyEncrypted)
  const AESKey = AESKeyPadded.slice(0, 32)
  const iv = AESKeyPadded.slice(32, 64)

  // Decrypt data
  const encryptedBytesBuffer = forge.util.createBuffer(encryptedBytes)
  console.dir(encryptedBytesBuffer)
  const decipher = forge.cipher.createDecipher('AES-CBC', AESKey)
  decipher.start({ iv })
  decipher.update(encryptedBytesBuffer)
  decipher.finish()

  window.tester = {
    text,
    AESKeyEncrypted,
    encryptedBytes,
    AESKey,
    iv,
    encryptedBytesBuffer
  }
  window.decipher = () => {
    return forge.cipher.createDecipher('AES-CBC', AESKey)
  }

  return decipher.output.toString()
}

// Key should be a forge public key
export const EncryptRSA = (unencrypted, RSAKey) => {
  // Generate random AES-256 key
  const AESKey = forge.random.getBytesSync(32)
  const iv = forge.random.getBytesSync(32)
  const cipher = forge.cipher.createCipher('AES-CBC', AESKey)
  cipher.start({ iv })
  cipher.update(forge.util.createBuffer(unencrypted))
  cipher.finish()
  const encrypted = cipher.output

  // Encrypt AES-256 key using RSA
  const AESKeyEncrypted = RSAKey.encrypt(AESKey + iv)

  return [AESKeyEncrypted, encrypted.bytes().toString()].join('')
}
