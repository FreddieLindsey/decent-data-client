import {
  // IPFSSTORAGE_ADDRESS_GET_PENDING,
  IPFSSTORAGE_ADDRESS_GET_SUCCESS,
  IPFSSTORAGE_ADDRESS_GET_ERROR,
  // IPFSSTORAGE_VALUE_GET_PENDING,
  IPFSSTORAGE_VALUE_GET_SUCCESS,
  IPFSSTORAGE_VALUE_GET_ERROR,
  // IPFSSTORAGE_VALUE_ADD_PENDING,
  IPFSSTORAGE_VALUE_ADD_SUCCESS,
  IPFSSTORAGE_VALUE_ADD_ERROR,
  // IPFSSTORAGE_SIZE_GET_PENDING,
  IPFSSTORAGE_SIZE_GET_SUCCESS,
  IPFSSTORAGE_SIZE_GET_ERROR
} from '../../actions'

const initialState = {
  address: undefined,
  size: undefined,
  values: []
}

export const IPFSStorage = (state = initialState, action) => {
  switch (action.type) {
    case IPFSSTORAGE_ADDRESS_GET_SUCCESS:
      return handleAddressGetSuccess(state, action.address)
    case IPFSSTORAGE_ADDRESS_GET_ERROR:
      return handleAddressGetError(state, action.error)
    case IPFSSTORAGE_VALUE_GET_SUCCESS:
      return handleValueGetSuccess(state, action.index, action.value)
    case IPFSSTORAGE_VALUE_GET_ERROR:
      return handleValueGetError(state, action.error)
    case IPFSSTORAGE_VALUE_ADD_SUCCESS:
      return handleValueAddSuccess(state, action.value)
    case IPFSSTORAGE_VALUE_ADD_ERROR:
      return handleValueAddError(state, action.error)
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

const handleValueGetSuccess = (state, index, value) => {
  let values = state.values
  values[index] = value
  return {
    ...state,
    error: undefined,
    values
  }
}

const handleValueGetError   = (state, error) => {
  return {
    ...state,
    error
  }
}

const handleValueAddSuccess = (state, value) => {
  const values = [
    ...state.values,
    value
  ]
  const size = state.size + 1
  return {
    ...state,
    error: undefined,
    size,
    values
  }
}

const handleValueAddError   = (state, error) => {
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
