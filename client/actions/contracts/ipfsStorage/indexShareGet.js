// Get path from index
export const IPFSSTORAGE_INDEX_SHARE_GET_PENDING = 'IPFSSTORAGE_INDEX_SHARE_GET_PENDING'
export const IPFSSTORAGE_INDEX_SHARE_GET_SUCCESS = 'IPFSSTORAGE_INDEX_SHARE_GET_SUCCESS'
export const IPFSSTORAGE_INDEX_SHARE_GET_ERROR   = 'IPFSSTORAGE_INDEX_SHARE_GET_ERROR'

export const ipfsStorageIndexShareGet = (path, index) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageIndexShareGetPending(identity, path, index))
    contracts.IPFSStorage.at(storage)
    .getIndexShare(path, index, { from: getState().security.address })
    .then((value) => {
      const address = value[0]
      const permissions = value[1]
      dispatch(ipfsStorageIndexShareGetSuccess(identity, path, index, address, permissions))
    })
    .catch((error) => {
      dispatch(ipfsStorageIndexShareGetError(identity, path, index, error))
    })
  }
}

const ipfsStorageIndexShareGetPending = (identity, path, index) => {
  return {
    type: IPFSSTORAGE_INDEX_SHARE_GET_PENDING,
    identity,
    path,
    index
  }
}

const ipfsStorageIndexShareGetSuccess = (identity, path, index, address, permissions) => {
  return {
    type: IPFSSTORAGE_INDEX_SHARE_GET_SUCCESS,
    identity,
    path,
    index,
    address,
    permissions
  }
}

const ipfsStorageIndexShareGetError   = (identity, path, index, error) => {
  return {
    type: IPFSSTORAGE_INDEX_SHARE_GET_ERROR,
    identity,
    path,
    index,
    error
  }
}
