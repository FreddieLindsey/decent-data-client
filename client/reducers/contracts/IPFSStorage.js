import {
  // IPFSSTORAGE_ADDRESS_GET_PENDING,
  IPFSSTORAGE_ADDRESS_GET_SUCCESS,
  IPFSSTORAGE_ADDRESS_GET_ERROR,
  // IPFSSTORAGE_VALUE_GET_PENDING,
  IPFSSTORAGE_VALUE_GET_SUCCESS,
  IPFSSTORAGE_VALUE_GET_ERROR,
  // IPFSSTORAGE_VALUE_SET_PENDING,
  IPFSSTORAGE_VALUE_SET_SUCCESS,
  IPFSSTORAGE_VALUE_SET_ERROR,
  // IPFSSTORAGE_SIZE_GET_PENDING,
  IPFSSTORAGE_SIZE_GET_SUCCESS,
  IPFSSTORAGE_SIZE_GET_ERROR
} from '../../actions'

const IPFSStorage = (state = {}, action) => {
  switch (action.type) {
    case IPFSSTORAGE_ADDRESS_GET_SUCCESS:
      return handleAddressGetSuccess(state, action.address)
    case IPFSSTORAGE_ADDRESS_GET_ERROR:
      return handleAddressGetError(state, action.error)
    case IPFSSTORAGE_VALUE_GET_SUCCESS:
      return handleValueGetSuccess(state, action.value)
    case IPFSSTORAGE_VALUE_GET_ERROR:
      return handleValueGetError(state, action.error)
    case IPFSSTORAGE_VALUE_SET_SUCCESS:
      return handleValueSetSuccess(state, action.value)
    case IPFSSTORAGE_VALUE_SET_ERROR:
      return handleValueSetError(state, action.error)
    case IPFSSTORAGE_SIZE_GET_SUCCESS:
      return handleSizeGetSuccess(state, action.size)
    case IPFSSTORAGE_SIZE_GET_ERROR:
      return handleSizeGetError(state, action.error)
  }
  return state
}

const handleAddressGetSuccess = (state, address) => {
  return {
    ...state,
    error: undefined,
    address
  }
}

const handleAddressGetError   = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleValueGetSuccess = (state, value) => {
  return {
    ...state,
    error: undefined,
    value
  }
}

const handleValueGetError   = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleValueSetSuccess = (state, value) => {
  return {
    ...state,
    error: undefined,
    value
  }
}

const handleValueSetError   = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleSizeGetSuccess = (state, size) => {
  return {
    ...state,
    error: undefined,
    size
  }
}

const handleSizeGetError   = (state, error) => {
  return {
    ...state,
    error
  }
}

export default IPFSStorage
