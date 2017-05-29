import {
  LOGOUT,
  // REGISTRY_ADD_STORE_PENDING,
  REGISTRY_ADD_STORE_SUCCESS,
  REGISTRY_ADD_STORE_ERROR,
  // REGISTRY_GET_STORE_PENDING,
  REGISTRY_GET_STORE_SUCCESS,
  REGISTRY_GET_STORE_ERROR,
  LOAD_ECDSA_PRIVATE_KEY_SUCCESS,
} from '../../actions'

const initialState = {
  store: {
    retrieved: false,
    triedGet: false,
    triedAdd: false,
    error: undefined,
  }
}

export const Registry = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...initialState }
    case REGISTRY_ADD_STORE_SUCCESS:
      return handleRegistryAddStoreSuccess(state)
    case REGISTRY_ADD_STORE_ERROR:
      return handleRegistryAddStoreError(state, action.error)
    case REGISTRY_GET_STORE_SUCCESS:
      return handleRegistryGetStoreSuccess(state)
    case REGISTRY_GET_STORE_ERROR:
      return handleRegistryGetStoreError(state, action.error)
    case LOAD_ECDSA_PRIVATE_KEY_SUCCESS:
      return { ...state, store: initialState.store }
  }
  return state
}

const handleRegistryAddStoreSuccess = (state) => {
  let store = {
    ...state.store,
    triedAdd: true,
    error: undefined
  }
  return {
    ...state,
    store
  }
}

const handleRegistryAddStoreError = (state, error) => {
  let store = {
    ...state.store,
    triedAdd: true,
    error
  }
  return {
    ...state,
    store
  }
}

const handleRegistryGetStoreSuccess = (state) => {
  let store = {
    ...state.store,
    triedGet: true,
    retrieved: true,
    error: undefined
  }
  return {
    ...state,
    store
  }
}

const handleRegistryGetStoreError = (state, error) => {
  let store = {
    ...state.store,
    triedGet: true,
    retrieved: false,
    error
  }
  return {
    ...state,
    store
  }
}
