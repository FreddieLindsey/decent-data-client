import request from 'superagent'

// Retrieving files from IPFS
export const FILE_RETRIEVE_PENDING = 'FILE_RETRIEVE_PENDING'
export const FILE_RETRIEVE_SUCCESS = 'FILE_RETRIEVE_SUCCESS'
export const FILE_RETRIEVE_ERROR   = 'FILE_RETRIEVE_ERROR'

export const fileRetrieve = (path, address = undefined) => {
  return (dispatch, getState) => {
    const identity = address || getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address

    dispatch(fileRetrievePending(identity, path))
    Request
      .get(process.env.API_ENDPOINT + '/ipfs')
      .query({ identity, path })
      .end((err, res) => {
        if (err) {
          dispatch(fileRetrieveError(identity, path, err))
        } else {
          const data = files[0].content.toString()
          const { encryption: { secretKey } } = getState().security
          request
            .post('http://localhost:7000/encryption/decrypt/second')
            .send({ secretKey, data })
            .then(content => dispatch(fileRetrieveSuccess(identity, path, content)))
            .catch(err => dispatch(fileRetrieveError(identity, path, err)))
        }
      })
  }
}

export const fileRetrievePending = (address, path) => {
  return {
    type: FILE_RETRIEVE_PENDING,
    address,
    path
  }
}

export const fileRetrieveSuccess = (address, path, content) => {
  // path and content
  return {
    type: FILE_RETRIEVE_SUCCESS,
    address,
    path,
    content
  }
}

export const fileRetrieveError = (address, path, error) => {
  return {
    type: FILE_RETRIEVE_ERROR,
    address,
    path,
    error
  }
}
