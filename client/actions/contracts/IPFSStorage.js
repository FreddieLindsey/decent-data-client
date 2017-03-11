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
    dispatch(ipfsStorageValueGetSuccess(index, value))
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

// Get Value
export const IPFSSTORAGE_VALUE_ADD_PENDING = 'IPFSSTORAGE_VALUE_ADD_PENDING'
export const IPFSSTORAGE_VALUE_ADD_SUCCESS = 'IPFSSTORAGE_VALUE_ADD_SUCCESS'
export const IPFSSTORAGE_VALUE_ADD_ERROR   = 'IPFSSTORAGE_VALUE_ADD_ERROR'

export const ipfsStorageValueAdd = (dispatch, value, address) => {
  dispatch(ipfsStorageValueAddPending())
  window.contracts.IPFSStorage.deployed()
  .then((instance) => {
    return instance.add(value, { from: address })
  })
  .then((receipt) => {
    console.dir(receipt)
    dispatch(ipfsStorageValueAddSuccess(value))
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
    dispatch(ipfsStorageSizeGetSuccess(size.toNumber()))
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
