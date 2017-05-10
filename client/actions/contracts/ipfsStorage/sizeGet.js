// Get size of storedData
export const IPFSSTORAGE_SIZE_GET_PENDING = 'IPFSSTORAGE_SIZE_GET_PENDING'
export const IPFSSTORAGE_SIZE_GET_SUCCESS = 'IPFSSTORAGE_SIZE_GET_SUCCESS'
export const IPFSSTORAGE_SIZE_GET_ERROR   = 'IPFSSTORAGE_SIZE_GET_ERROR'

export const ipfsStorageSizeGet = () => {
  return (dispatch, getState) => {
    dispatch(ipfsStorageSizeGetPending())
    contracts.IPFSStorage.at(getState().IPFSStorage.address)
    .size({ from: getState().security.address })
    .then((size) => {
      dispatch(ipfsStorageSizeGetSuccess(size.toNumber()))
    })
    .catch((error) => {
      dispatch(ipfsStorageSizeGetError(error))
    })
  }
}

const ipfsStorageSizeGetPending = () => {
  return {
    type: IPFSSTORAGE_SIZE_GET_PENDING
  }
}

const ipfsStorageSizeGetSuccess = (size) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_SUCCESS,
    size
  }
}

const ipfsStorageSizeGetError   = (error) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_ERROR,
    error
  }
}
