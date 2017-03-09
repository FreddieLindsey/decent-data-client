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

// Get Value
export const IPFSSTORAGE_VALUE_GET_PENDING = 'IPFSSTORAGE_VALUE_GET_PENDING'
export const IPFSSTORAGE_VALUE_GET_SUCCESS = 'IPFSSTORAGE_VALUE_GET_SUCCESS'
export const IPFSSTORAGE_VALUE_GET_ERROR   = 'IPFSSTORAGE_VALUE_GET_ERROR'

export const ipfsStorageValueGet = (dispatch, index) => {
  dispatch(ipfsStorageValueGetPending())
  if (index === undefined || typeof index !== 'number') {
    dispatch(ipfsStorageValueGetError('Please give number index to getter'))
    return
  }
  window.contracts.IPFSStorage.deployed()
  .then((instance) => {
    return instance.get(index)
  })
  .then((value) => {
    dispatch(ipfsStorageValueGetSuccess(value))
  })
  .catch((error) => {
    dispatch(ipfsStorageValueGetError(error))
  })
}

const ipfsStorageValueGetPending = () => {
  return {
    type: IPFSSTORAGE_VALUE_GET_PENDING
  }
}

const ipfsStorageValueGetSuccess = (value) => {
  return {
    type: IPFSSTORAGE_VALUE_GET_SUCCESS,
    value
  }
}

const ipfsStorageValueGetError   = (error) => {
  return {
    type: IPFSSTORAGE_VALUE_GET_ERROR,
    error
  }
}

// Get Value
export const IPFSSTORAGE_VALUE_SET_PENDING = 'IPFSSTORAGE_VALUE_SET_PENDING'
export const IPFSSTORAGE_VALUE_SET_SUCCESS = 'IPFSSTORAGE_VALUE_SET_SUCCESS'
export const IPFSSTORAGE_VALUE_SET_ERROR   = 'IPFSSTORAGE_VALUE_SET_ERROR'

export const ipfsStorageValueSet = (dispatch, value, address) => {
  dispatch(ipfsStorageValueSetPending())
  window.contracts.IPFSStorage.deployed()
  .then((instance) => {
    return instance.set(value, { from: address })
  })
  .then((receipt) => {
    console.dir(receipt)
    dispatch(ipfsStorageValueSetSuccess(value))
  })
  .catch((error) => {
    dispatch(ipfsStorageValueSetError(error))
  })
}

const ipfsStorageValueSetPending = () => {
  return {
    type: IPFSSTORAGE_VALUE_SET_PENDING
  }
}

const ipfsStorageValueSetSuccess = (value) => {
  return {
    type: IPFSSTORAGE_VALUE_SET_SUCCESS,
    value
  }
}

const ipfsStorageValueSetError   = (error) => {
  return {
    type: IPFSSTORAGE_VALUE_SET_ERROR,
    error
  }
}

// Get size of storedData
export const IPFSSTORAGE_SIZE_GET_PENDING = 'IPFSSTORAGE_SIZE_GET_PENDING'
export const IPFSSTORAGE_SIZE_GET_SUCCESS = 'IPFSSTORAGE_SIZE_GET_SUCCESS'
export const IPFSSTORAGE_SIZE_GET_ERROR   = 'IPFSSTORAGE_SIZE_GET_ERROR'

export const ipfsStorageSizeGet = (dispatch) => {
  dispatch(ipfsStorageSizeGetPending())
  window.contracts.IPFSStorage.deployed()
  .then((instance) => {
    return instance.size()
  })
  .then((size) => {
    dispatch(ipfsStorageSizeGetSuccess(size))
  })
  .catch((error) => {
    dispatch(ipfsStorageSizeGetError(error))
  })
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
