import { expect } from 'chai'
import HashByte from '../../utils/HashByte'

describe('Utils: HashByte', () => {

  describe('converting to Hash', () => {

    it('should give empty string for empty input', () => {
      expect(HashByte.toByteArray('')).to.equal('')
    })

    it('should give zero string for empty input with size', () => {
      expect(HashByte.toByteArray('', 64)).to.equal(new Uint8Array(64).join(''))
    })

  })

  describe('converting to Byte Array (string)', () => {

  })

})
