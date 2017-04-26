export default class Pad {

  static pad(str, len) {
    while (str.length < len) str += ' '
    return str
  }

}
