// Get path from index
export const IPFSSTORAGE_INDEX_GET_PENDING = 'IPFSSTORAGE_INDEX_GET_PENDING'
export const IPFSSTORAGE_INDEX_GET_SUCCESS = 'IPFSSTORAGE_INDEX_GET_SUCCESS'
export const IPFSSTORAGE_INDEX_GET_ERROR   = 'IPFSSTORAGE_INDEX_GET_ERROR'

export const ipfsStorageIndexGet = (index) => {
  return (dispatch, getState) => {
    dispatch(ipfsStorageIndexGetPending(index))
    contracts.IPFSStorage.at(getState().IPFSStorage.address)
    .getIndex(index, { from: getState().security.address })
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
