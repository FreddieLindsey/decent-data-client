// Get Address
export const IPFSSTORAGE_ADDRESS_GET_PENDING = 'IPFSSTORAGE_ADDRESS_GET_PENDING'
export const IPFSSTORAGE_ADDRESS_GET_SUCCESS = 'IPFSSTORAGE_ADDRESS_GET_SUCCESS'
export const IPFSSTORAGE_ADDRESS_GET_ERROR   = 'IPFSSTORAGE_ADDRESS_GET_ERROR'

export const ipfsStorageAddressGet = (dispatch) => {
  dispatch(ipfsStorageAddressGetPending())
  window.contracts.IPFSStorage.deployed()
  .then((instance) => {
    dispatch(ipfsStorageAddressGetSuccess(instance.address))
  })
  .catch((err) => {
    dispatch(ipfsStorageAddressGetError(err))
  })
}

const ipfsStorageAddressGetPending = () => {
  return {
    type: IPFSSTORAGE_ADDRESS_GET_PENDING
  }
}

const ipfsStorageAddressGetSuccess = (address) => {
  return {
    type: IPFSSTORAGE_ADDRESS_GET_SUCCESS,
    address
  }
}

const ipfsStorageAddressGetError   = (error) => {
  return {
    type: IPFSSTORAGE_ADDRESS_GET_ERROR,
    error
  }
}
