// Get path from index
export const IPFSSTORAGE_INDEX_GET_PENDING = 'IPFSSTORAGE_INDEX_GET_PENDING'
export const IPFSSTORAGE_INDEX_GET_SUCCESS = 'IPFSSTORAGE_INDEX_GET_SUCCESS'
export const IPFSSTORAGE_INDEX_GET_ERROR   = 'IPFSSTORAGE_INDEX_GET_ERROR'

export const ipfsStorageIndexGet = (index) => {
  return (dispatch) => {
    dispatch(ipfsStorageIndexGetPending(index))
    window.contracts.IPFSStorage.deployed()
    .then((instance) => {
      return instance.getIndex(index)
    })
    .then((path) => {
      dispatch(ipfsStorageIndexGetSuccess(index, path))
    })
    .catch((error) => {
      dispatch(ipfsStorageIndexGetError(index, error))
    })
  }
}

const ipfsStorageIndexGetPending = (index) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_PENDING,
    index
  }
}

const ipfsStorageIndexGetSuccess = (index, path) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_SUCCESS,
    index,
    path
  }
}

const ipfsStorageIndexGetError   = (index, error) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_ERROR,
    index,
    error
  }
}
