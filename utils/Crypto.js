import forge from 'node-forge'

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
