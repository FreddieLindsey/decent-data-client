// Get path from index
export const IPFSSTORAGE_INDEX_GET_PENDING = 'IPFSSTORAGE_INDEX_GET_PENDING'
export const IPFSSTORAGE_INDEX_GET_SUCCESS = 'IPFSSTORAGE_INDEX_GET_SUCCESS'
export const IPFSSTORAGE_INDEX_GET_ERROR   = 'IPFSSTORAGE_INDEX_GET_ERROR'

export const ipfsStorageIndexGet = (index, address = undefined) => {
  return (dispatch, getState) => {
    const identity = address || getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageIndexGetPending(identity, index))
    contracts.IPFSStorage.at(storage)
    .getIndex(index, { from: getState().security.address })
    .then((path) => {
      dispatch(ipfsStorageIndexGetSuccess(identity, index, path))
    })
    .catch((error) => {
      dispatch(ipfsStorageIndexGetError(identity, index, error))
    })
  }
}

const ipfsStorageIndexGetPending = (address, index) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_PENDING,
    address,
    index
  }
}

const ipfsStorageIndexGetSuccess = (address, index, path) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_SUCCESS,
    address,
    index,
    path
  }
}

const ipfsStorageIndexGetError   = (address, index, error) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_ERROR,
    address,
    index,
    error
  }
}
