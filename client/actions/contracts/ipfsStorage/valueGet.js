// Get Value
export const IPFSSTORAGE_VALUE_GET_PENDING = 'IPFSSTORAGE_VALUE_GET_PENDING'
export const IPFSSTORAGE_VALUE_GET_SUCCESS = 'IPFSSTORAGE_VALUE_GET_SUCCESS'
export const IPFSSTORAGE_VALUE_GET_ERROR   = 'IPFSSTORAGE_VALUE_GET_ERROR'

export const ipfsStorageValueGet = (index) => {
  return (dispatch, getState) => {
    dispatch(ipfsStorageValueGetPending())
    if (index === undefined || typeof index !== 'number') {
      dispatch(ipfsStorageValueGetError('Please give number index to getter'))
      return
    }
    contracts.IPFSStorage.at(getState().IPFSStorage.address)
    .then((instance) => {
      return instance.get(index)
    })
    .then((value) => {
      dispatch(ipfsStorageValueGetSuccess(index, value))
    })
    .catch((error) => {
      dispatch(ipfsStorageValueGetError(error))
    })
  }
}

const ipfsStorageValueGetPending = () => {
  return {
    type: IPFSSTORAGE_VALUE_GET_PENDING
  }
}

const ipfsStorageValueGetSuccess = (index, value) => {
  return {
    type: IPFSSTORAGE_VALUE_GET_SUCCESS,
    index,
    value
  }
}

const ipfsStorageValueGetError   = (error) => {
  return {
    type: IPFSSTORAGE_VALUE_GET_ERROR,
    error
  }
}
