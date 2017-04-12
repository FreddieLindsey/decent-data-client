const hexadecimal = [
  '0', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
]

export default class HashByte {

  static toByteArray = (hash, size = undefined) => {
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

  }

}
