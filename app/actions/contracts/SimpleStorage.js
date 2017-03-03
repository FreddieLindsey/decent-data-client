// Get Address
export const SIMPLESTORAGE_ADDRESS_GET_PENDING = 'SIMPLESTORAGE_ADDRESS_GET_PENDING'
export const SIMPLESTORAGE_ADDRESS_GET_SUCCESS = 'SIMPLESTORAGE_ADDRESS_GET_SUCCESS'
export const SIMPLESTORAGE_ADDRESS_GET_ERROR   = 'SIMPLESTORAGE_ADDRESS_GET_ERROR'

export const simpleStorageAddressGet = (dispatch, done) => {
  dispatch(simpleStorageAddressGetPending())
  window.contracts.SimpleStorage.deployed()
  .then((instance) => {
    dispatch(simpleStorageAddressGetSuccess(instance.address))
  })
  .then(() => (typeof done === 'function') && done())
  .catch((err) => {
    dispatch(simpleStorageAddressGetError(err))
  })
}

const simpleStorageAddressGetPending = () => {
  return {
    type: SIMPLESTORAGE_ADDRESS_GET_PENDING
  }
}

const simpleStorageAddressGetSuccess = (address) => {
  return {
    type: SIMPLESTORAGE_ADDRESS_GET_SUCCESS,
    address
  }
}

const simpleStorageAddressGetError   = (error) => {
  return {
    type: SIMPLESTORAGE_ADDRESS_GET_ERROR,
    error
  }
}

// Get Value
export const SIMPLESTORAGE_VALUE_GET_PENDING = 'SIMPLESTORAGE_VALUE_GET_PENDING'
export const SIMPLESTORAGE_VALUE_GET_SUCCESS = 'SIMPLESTORAGE_VALUE_GET_SUCCESS'
export const SIMPLESTORAGE_VALUE_GET_ERROR   = 'SIMPLESTORAGE_VALUE_GET_ERROR'

export const simpleStorageValueGet = (dispatch, done) => {
  dispatch(simpleStorageValueGetPending())
  window.contracts.SimpleStorage.deployed()
  .then((instance) => {
    return instance.get()
  })
  .then((value) => {
    dispatch(simpleStorageValueGetSuccess(value))
  })
  .then(() => (typeof done === 'function') && done())
  .catch((error) => {
    dispatch(simpleStorageValueGetError(error))
  })
}

const simpleStorageValueGetPending = () => {
  return {
    type: SIMPLESTORAGE_VALUE_GET_PENDING
  }
}

const simpleStorageValueGetSuccess = (value) => {
  return {
    type: SIMPLESTORAGE_VALUE_GET_SUCCESS,
    value
  }
}

const simpleStorageValueGetError   = (error) => {
  return {
    type: SIMPLESTORAGE_VALUE_GET_ERROR,
    error
  }
}

// Get Value
export const SIMPLESTORAGE_VALUE_SET_PENDING = 'SIMPLESTORAGE_VALUE_SET_PENDING'
export const SIMPLESTORAGE_VALUE_SET_SUCCESS = 'SIMPLESTORAGE_VALUE_SET_SUCCESS'
export const SIMPLESTORAGE_VALUE_SET_ERROR   = 'SIMPLESTORAGE_VALUE_SET_ERROR'

export const simpleStorageValueSet = (dispatch, value, address, done) => {
  dispatch(simpleStorageValueSetPending())
  window.contracts.SimpleStorage.deployed()
  .then((instance) => {
    return instance.set(value, { from: address })
  })
  .then((receipt) => {
    console.dir(receipt)
    dispatch(simpleStorageValueSetSuccess(value))
  })
  .then(() => (typeof done === 'function') && done())
  .catch((error) => {
    dispatch(simpleStorageValueSetError(error))
  })
}

const simpleStorageValueSetPending = () => {
  return {
    type: SIMPLESTORAGE_VALUE_SET_PENDING
  }
}

const simpleStorageValueSetSuccess = (value) => {
  return {
    type: SIMPLESTORAGE_VALUE_SET_SUCCESS,
    value
  }
}

const simpleStorageValueSetError   = (error) => {
  return {
    type: SIMPLESTORAGE_VALUE_SET_ERROR,
    error
  }
}
