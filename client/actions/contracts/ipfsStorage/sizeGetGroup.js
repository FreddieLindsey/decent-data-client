// Get size of storedData
import {
  IPFSSTORAGE_SIZE_GET_PENDING,
  IPFSSTORAGE_SIZE_GET_SUCCESS,
  IPFSSTORAGE_SIZE_GET_ERROR
} from './sizeGet'

export const ipfsStorageSizeGetGroup = (address, group) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.identities[address].address
    dispatch(ipfsStorageSizeGetGroupPending(address))
    contracts.IPFSStorage.at(storage)
    .sizeGroup(group, { from: identity })
    .then((size) => {
      dispatch(ipfsStorageSizeGetGroupSuccess(address, size.toNumber()))
    })
    .catch((error) => {
      dispatch(ipfsStorageSizeGetGroupError(address, error))
    })
  }
}

const ipfsStorageSizeGetGroupPending = (address) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_PENDING,
    address
  }
}

const ipfsStorageSizeGetGroupSuccess = (address, size) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_SUCCESS,
    address,
    size
  }
}

const ipfsStorageSizeGetGroupError   = (address, error) => {
  return {
    type: IPFSSTORAGE_SIZE_GET_ERROR,
    address,
    error
  }
}
