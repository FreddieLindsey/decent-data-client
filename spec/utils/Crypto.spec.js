import { expect } from 'chai'
import * as Crypto from '../../utils/Crypto'

describe('Utils: Crypto', () => {

  const text = global.files['text']
  const nyancat = global.files['nyancat.gif']
  const dicom = global.files['Knee.dcm']

  describe('Generating encryption keys', () => {

    it('can generate a 128-bit AES key as 16 ints', () => {
      const key = Crypto.generateAESKey()
      expect(key.length).to.equal(16)
      for (const i in key)
        expect(key.charCodeAt(i)).to.be.a('number')
    })

    it('can generate a 64-bit iv as 8 ints', () => {
      const key = Crypto.generateIv()
      expect(key.length).to.equal(8)
      for (const i in key)
        expect(key.charCodeAt(i)).to.be.a('number')
    })

  })

  describe('Encrypting/Decrypting content', () => {

    it('can encrypt content (text)', () => {
      const key = Crypto.generateAESKey()
      const iv = Crypto.generateIv()
      const encrypted = Crypto.encryptAES(text, key, iv)
    })

    it('can decrypt encrypted content (text)', () => {
      const key = Crypto.generateAESKey()
      const iv = Crypto.generateIv()
      const encrypted = Crypto.encryptAES(text, key, iv)

      const decrypted = Crypto.decryptAES(encrypted, key, iv).toString()
      const content = text.toString()
      expect(decrypted).to.equal(content)
    })

    it('can encrypt content (image)', () => {
      const key = Crypto.generateAESKey()
      const iv = Crypto.generateIv()
      const encrypted = Crypto.encryptAES(nyancat, key, iv)
    })

    it('can decrypt encrypted content (image)', () => {
      const key = Crypto.generateAESKey()
      const iv = Crypto.generateIv()
      const encrypted = Crypto.encryptAES(nyancat, key, iv)

      const decrypted = Crypto.decryptAES(encrypted, key, iv).toString()
      const content = nyancat.toString()
      expect(decrypted).to.equal(content)
    })

    it('can encrypt content', () => {
      const key = Crypto.generateAESKey()
      const iv = Crypto.generateIv()
      const encrypted = Crypto.encryptAES(dicom, key, iv)
    })

    it('can decrypt encrypted content', () => {
      const key = Crypto.generateAESKey()
      const iv = Crypto.generateIv()
      const encrypted = Crypto.encryptAES(dicom, key, iv)

      const decrypted = Crypto.decryptAES(encrypted, key, iv).toString()
      const content = dicom.toString()
      expect(decrypted).to.equal(content)
    })

  })

})
