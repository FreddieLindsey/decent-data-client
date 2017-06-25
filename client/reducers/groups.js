import {
  REGISTRY_CREATE_GROUP_SUCCESS,
  REGISTRY_CREATE_GROUP_ERROR,
  REGISTRY_GET_GROUPS_PENDING,
  REGISTRY_GET_GROUPS_SUCCESS,
  REGISTRY_GET_GROUPS_ERROR,
  GET_ACCOUNTS_SUCCESS
} from '../actions'

const initialState = {}

const groups = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS_SUCCESS:
      return handleGetAccountsSuccess(state, action.accounts)
    case REGISTRY_CREATE_GROUP_SUCCESS:
      return handleRegistryCreateGroupSuccess(state, action.identity, action.group)
    case REGISTRY_CREATE_GROUP_ERROR:
      return handleRegistryCreateGroupError(state, action.identity, action.error)
    case REGISTRY_GET_GROUPS_PENDING:
      return handleRegistryGetGroupsPending(state, action.identity)
    case REGISTRY_GET_GROUPS_SUCCESS:
      return handleRegistryGetGroupsSuccess(state, action.identity, action.groups)
    case REGISTRY_GET_GROUPS_ERROR:
      return handleRegistryGetGroupsError(state, action.identity, action.error)
    default:
      return state
  }
}

const validateGroups = (groups) => ({
  pending: false,
  groups: [],
  ...groups
})

const handleGetAccountsSuccess = (state, accounts) => {
  let newState = { ...state }
  for (const i of accounts)
    newState[i] = validateGroups(newState[i])
  return newState
}

const handleRegistryCreateGroupSuccess = (state, address, group) => {
  let newState = { ...state }
  newState[address].groups.push({ contract: group, address: group.address })
  newState[address] = validateGroups({ ...newState[address], groups: newState[address].groups })
  return newState
}

const handleRegistryCreateGroupError = (state, address, error) => {
  // TODO
  return state
}

const handleRegistryGetGroupsPending = (state, address) => {
  let newState = { ...state }
  newState[address] = validateGroups({ ...newState[address], pending: true })
  return newState
}

const handleRegistryGetGroupsSuccess = (state, address, groups) => {
  let newState = { ...state }
  newState[address] = validateGroups({ ...newState[address], pending: false, groups })
  return newState
}

const handleRegistryGetGroupsError = (state, address, error) => {
  let newState = { ...state }
  newState[address] = validateGroups({ ...newState[address], error })
  return newState
}

export default groups
