// Get size of storedData
export const IPFSSTORAGE_SIZE_SHARED_GET_PENDING = 'IPFSSTORAGE_SIZE_SHARED_GET_PENDING'
export const IPFSSTORAGE_SIZE_SHARED_GET_SUCCESS = 'IPFSSTORAGE_SIZE_SHARED_GET_SUCCESS'
export const IPFSSTORAGE_SIZE_SHARED_GET_ERROR   = 'IPFSSTORAGE_SIZE_SHARED_GET_ERROR'

export const ipfsStorageSizeShareGet = (path, address = undefined) => {
  return (dispatch, getState) => {
    const identity = address || getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageSizeShareGetPending(identity, path))
    contracts.IPFSStorage.at(storage)
    .sizeShare(path, { from: getState().security.address })
    .then((size) => {
      dispatch(ipfsStorageSizeShareGetSuccess(identity, path, size.toNumber()))
    })
    .catch((error) => {
      dispatch(ipfsStorageSizeShareGetError(identity, path, error))
    })
  }
}

const ipfsStorageSizeShareGetPending = (address, path) => {
  return {
    type: IPFSSTORAGE_SIZE_SHARED_GET_PENDING,
    address,
    path
  }
}

const ipfsStorageSizeShareGetSuccess = (address, path, size) => {
  return {
    type: IPFSSTORAGE_SIZE_SHARED_GET_SUCCESS,
    address,
    path,
    size
  }
}

const ipfsStorageSizeShareGetError   = (address, path, error) => {
  return {
    type: IPFSSTORAGE_SIZE_SHARED_GET_ERROR,
    address,
    path,
    error
  }
}
