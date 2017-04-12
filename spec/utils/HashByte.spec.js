import { expect } from 'chai'
import HashByte from '../../utils/HashByte'

describe('Utils: HashByte', () => {

  const hash = 'Qm061864a08ae30bbd5933cba4cfcf621d401591fd'
  const byteArray = '516d3036313836346130386165333062626435393333636' +
                    '2613463666366363231643430313539316664'

  describe('converting to Hash', () => {

    it('should give undefined byte array for undefined hash', () => {
      expect(HashByte.toByteArray(undefined)).to.equal(undefined)
    })

    it('should give empty byte array for empty hash', () => {
      expect(HashByte.toByteArray('')).to.equal('')
    })

    it('should give zero string for empty input with size', () => {
      expect(HashByte.toByteArray('', 64)).to.equal(new Uint8Array(64).join(''))
    })

    it('should give correct ASCII byte array for a substring of hash', () => {
      expect(HashByte.toByteArray(hash.slice(0, 32)))
                        .to.equal(byteArray.slice(0, 64))
    })

    it('should give correct ASCII byte array for a hash', () => {
      expect(HashByte.toByteArray(hash)).to.equal(byteArray)
    })

  })

  describe('converting to Byte Array (string)', () => {

    it('should give empty hash for undefined byte array', () => {
      expect(HashByte.toHash(undefined)).to.equal(undefined)
    })

    it('should give empty hash for empty byte array', () => {
      expect(HashByte.toHash('')).to.equal('')
    })

    it('should give empty hash for empty byte array with 0x', () => {
      expect(HashByte.toHash('0x')).to.equal('')
    })

    it('should give correct hash for an ASCII byte array', () => {
      expect(HashByte.toHash(byteArray)).to.equal(hash)
    })

  })

})
