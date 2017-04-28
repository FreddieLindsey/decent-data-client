// APPLICATION REQUIRES ASYMMETRIC KEYS
// ALLOWED: RSA
export const validateKey = (contents, done) => {
  let allowedTypes = ['RSA']
  let trimmed = contents.trim()

  let error = () => done('File contents not a valid private key')

  /*
     Assume that a correct key will be of the form
     ----- BEGIN [TYPE] [PRIVATE/PUBLIC] KEY -----
     .........
     ----- END [TYPE] [PRIVATE/PUBLIC] KEY -----
  */
  let split = trimmed.split('-')
  let splitNoBlank = split.filter((e) => e !== '')
  if (splitNoBlank.length !== 3) {
    error()
    return
  }

  let start = splitNoBlank[0].split(' ')
  let key = splitNoBlank[1]
  let end = splitNoBlank[2].split(' ')

  if (start.length === 4 &&
      start[0] === 'BEGIN' && start[3] === 'KEY' &&
      end.length === 4 &&
      end[0] === 'END' && end[3] === 'KEY' &&
      start[1] === end[1] && start[2] === end[2] &&
      allowedTypes.indexOf(start[1]) !== -1 && start[2] === 'PRIVATE') {
    done(undefined, key, start[1])
  } else {
    error()
  }
}
