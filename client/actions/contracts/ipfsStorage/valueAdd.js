// Add Value
export const IPFSSTORAGE_VALUE_ADD_PENDING = 'IPFSSTORAGE_VALUE_ADD_PENDING'
export const IPFSSTORAGE_VALUE_ADD_SUCCESS = 'IPFSSTORAGE_VALUE_ADD_SUCCESS'
export const IPFSSTORAGE_VALUE_ADD_ERROR   = 'IPFSSTORAGE_VALUE_ADD_ERROR'

export const ipfsStorageValueAdd = (dispatch, value, address) => {
  dispatch(ipfsStorageValueAddPending())
  window.contracts.IPFSStorage.deployed()
  .then((instance) => {
    return instance.add(value, { from: address })
  })
  .then((response) => {
    dispatch(ipfsStorageValueAddSuccess(response.additions))
  })
  .catch((error) => {
    dispatch(ipfsStorageValueAddError(error))
  })
}

const ipfsStorageValueAddPending = () => {
  return {
    type: IPFSSTORAGE_VALUE_ADD_PENDING
  }
}

const ipfsStorageValueAddSuccess = (value) => {
  return {
    type: IPFSSTORAGE_VALUE_ADD_SUCCESS,
    value
  }
}

const ipfsStorageValueAddError   = (error) => {
  return {
    type: IPFSSTORAGE_VALUE_ADD_ERROR,
    error
  }
}
