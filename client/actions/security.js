// Load secure key
export const LOAD_SECURE_KEY_PENDING = 'LOAD_SECURE_KEY_PENDING'
export const LOAD_SECURE_KEY_SUCCESS = 'LOAD_SECURE_KEY_SUCCESS'
export const LOAD_SECURE_KEY_ERROR = 'LOAD_SECURE_KEY_ERROR'

export const loadSecureKey = (key) => {
  return (dispatch) => {
    dispatch(loadSecureKeyPending())
    const reader = new FileReader()
    reader.onload = (f) => {
      let contents = f.target.result
      validateKey(contents, (error, key, type) => {
        if (error !== undefined) {
          dispatch(loadSecureKeyError(error))
        } else {
          dispatch(loadSecureKeySuccess(key, type))
        }
      })
    }
    reader.onerror = (error) => {
      dispatch(loadSecureKeyError(error))
    }
    reader.readAsText(key[0])
  }
}

const validateKey = (contents, done) => {
  console.dir(contents)
  let trimmed = contents.trim()

  /*
     Assume that a correct key will be of the form
     ----- BEGIN [TYPE] [PRIVATE/PUBLIC] KEY -----
     .........
     ----- END [TYPE] [PRIVATE/PUBLIC] KEY -----
  */
  let split = trimmed.split('-')
  let splitNoBlank = split.filter((e) => e !== '')
  if (splitNoBlank.length !== 3) {
    done('File contents not a valid private key')
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
      start[2] === 'PRIVATE') {
    done(undefined, key, start[1])
  } else {
    done('File contents not a valid private key')
  }
}

const loadSecureKeyPending = () => {
  return {
    type: LOAD_SECURE_KEY_PENDING
  }
}

const loadSecureKeySuccess = (securekey, type) => {
  return {
    type: LOAD_SECURE_KEY_SUCCESS,
    securekey,
    keytype: type
  }
}

const loadSecureKeyError = (error) => {
  return {
    type: LOAD_SECURE_KEY_ERROR,
    error
  }
}
