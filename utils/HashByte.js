const hexadecimal = [
  '0', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
]

export default class HashByte {

  static toByteArray = (hash, size = undefined) => {
    if (hash === undefined) return hash

    let byteArray = ''
    for (let i = 0; i < hash.length; i++) {
      const charCode = hash.charCodeAt(i)
      if (charCode < 0 || charCode >= Math.pow(2, 8)) new Error('Not ASCII')
      byteArray += hexadecimal[(charCode - (charCode % 16)) / 16]
      byteArray += hexadecimal[charCode % 16]
    }

    if (size && typeof size === 'number' && size > 0) {
      while (byteArray.length < size) byteArray += '0'
    }

    return byteArray
  }

  static toHash = (byteArray) => {
    if (byteArray === undefined) return byteArray

    if (byteArray % 2 !== 0) new Error('Not convertible from ASCII')
    let hash = ''

    for (let i = 0; i < byteArray.length / 2; i++) {
      if (i == 0 && byteArray.indexOf('0x') === 0) continue

      let charCode = 0
      charCode += hexadecimal.indexOf(byteArray[i * 2]) * 16
      charCode += hexadecimal.indexOf(byteArray[i * 2 + 1])

      // Ensure matches A-Z/a-z/0-9
      if (charCode >= 48 && charCode < 58 ||
          charCode >= 65 && charCode < 91 ||
          charCode >= 97 && charCode < 123)
        hash += String.fromCharCode(charCode)

    }

    return hash
  }

}
