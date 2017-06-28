// Get path from index
import {
  IPFSSTORAGE_INDEX_GET_PENDING,
  IPFSSTORAGE_INDEX_GET_SUCCESS,
  IPFSSTORAGE_INDEX_GET_ERROR
} from './indexGet'

export const ipfsStorageIndexGetGroup = (index, address, name) => {
  return (dispatch, getState) => {
    console.log('GETTING INDEX GROUP')
    const identity = address || getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageIndexGetGroupPending(identity, index))
    contracts.IPFSStorage.at(storage)
    .getIndexGroup(index, name, { from: getState().security.address })
    .then((path) => {
      dispatch(ipfsStorageIndexGetGroupSuccess(identity, index, path))
    })
    .catch((error) => {
      dispatch(ipfsStorageIndexGetGroupError(identity, index, error))
    })
  }
}

const ipfsStorageIndexGetGroupPending = (address, index) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_PENDING,
    address,
    index
  }
}

const ipfsStorageIndexGetGroupSuccess = (address, index, path) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_SUCCESS,
    address,
    index,
    path
  }
}

const ipfsStorageIndexGetGroupError   = (address, index, error) => {
  return {
    type: IPFSSTORAGE_INDEX_GET_ERROR,
    address,
    index,
    error
  }
}
