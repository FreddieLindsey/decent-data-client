// Get size of storedData
export const IPFSSTORAGE_SIZE_GET_PENDING = 'IPFSSTORAGE_SIZE_GET_PENDING'
export const IPFSSTORAGE_SIZE_GET_SUCCESS = 'IPFSSTORAGE_SIZE_GET_SUCCESS'
export const IPFSSTORAGE_SIZE_GET_ERROR   = 'IPFSSTORAGE_SIZE_GET_ERROR'

export const ipfsStorageSizeGet = (address = undefined) => {
  return (dispatch, getState) => {
    const identity = address || getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageSizeGetPending(identity))
    contracts.IPFSStorage.at(storage)
    .size({ from: getState().security.address })
    .then((size) => {
      dispatch(ipfsStorageSizeGetSuccess(identity, size.toNumber()))
    })
    .catch((error) => {
      dispatch(ipfsStorageSizeGetError(identity, error))
    })
  }
}

const ipfsStorageSizeGetPending = (address) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_PENDING,
    address
  }
}

const ipfsStorageSizeGetSuccess = (address, size) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_SUCCESS,
    address,
    size
  }
}

const ipfsStorageSizeGetError   = (address, error) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_ERROR,
    address,
    error
  }
}
