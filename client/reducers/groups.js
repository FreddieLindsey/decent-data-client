import _ from 'underscore'

import {
  REGISTRY_CREATE_GROUP_SUCCESS,
  REGISTRY_CREATE_GROUP_ERROR,
  REGISTRY_GET_GROUPS_PENDING,
  REGISTRY_GET_GROUPS_SUCCESS,
  REGISTRY_GET_GROUPS_ERROR,
  IPFSSTORAGE_GET_GROUPS_PENDING,
  IPFSSTORAGE_GET_GROUPS_SUCCESS,
  IPFSSTORAGE_GET_GROUPS_ERROR,
  IPFSSTORAGE_ADD_GROUP_PENDING,
  IPFSSTORAGE_ADD_GROUP_SUCCESS,
  IPFSSTORAGE_ADD_GROUP_ERROR,
  GROUP_GET_MEMBERS_PENDING,
  GROUP_GET_MEMBERS_SUCCESS,
  GROUP_GET_MEMBERS_ERROR,
  GROUP_ADD_MEMBER_PENDING,
  GROUP_ADD_MEMBER_SUCCESS,
  GROUP_ADD_MEMBER_ERROR,
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
    case IPFSSTORAGE_GET_GROUPS_SUCCESS:
      return handleIpfsStorageGetGroupsSuccess(state, action.address, action.groups)
    case IPFSSTORAGE_ADD_GROUP_SUCCESS:
      return handleIpfsStorageAddGroupSuccess(state, action.address, action.group, action.name)
    case GROUP_GET_MEMBERS_SUCCESS:
      return handleGroupGetMembersSuccess(state, action.identity, action.group, action.members)
    case GROUP_ADD_MEMBER_SUCCESS:
      return handleGroupAddMemberSuccess(state, action.identity, action.group, action.member)
    default:
      return state
  }
}

const validateGroups = (groups) => ({
  pending: false,
  known: {},
  groups: [],
  ...groups
})

const validateGroup = (group) => ({
  address: null,
  contract: null,
  members: [],
  ...group
})

const handleGetAccountsSuccess = (state, accounts) => {
  let newState = { ...state }
  for (const i of accounts)
    newState[i] = validateGroups(newState[i])
  return newState
}

const handleRegistryCreateGroupSuccess = (state, address, group) => {
  let newState = { ...state }
  newState[address].groups.push(validateGroup({ contract: group, address: group.address }))
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
  newState[address] = validateGroups({
    ...newState[address], pending: false,
    groups
  })
  return newState
}

const handleRegistryGetGroupsError = (state, address, error) => {
  let newState = { ...state }
  newState[address] = validateGroups({ ...newState[address], error })
  return newState
}

const handleIpfsStorageGetGroupsSuccess = (state, address, groups) => {
  let newState = { ...state }
  newState[address] = validateGroups({ ...newState[address], known: groups })
  return newState
}

const handleIpfsStorageAddGroupSuccess = (state, address, group, name) => {
  let newState = { ...state }
  newState[address] = validateGroups({ ...newState[address] })
  let found = false
  for (const i of newState[address].known)
    if (i.name === name)
      found = true
  if (!found) newState[address].known.push({ name, address: group })
  return newState
}

const handleGroupGetMembersSuccess = (state, address, group, members) => {
  let newState = { ...state }
  for (const i of newState[address].groups)
    if (i.address === group)
      i.members = members
  return newState
}

const handleGroupAddMemberSuccess = (state, address, group, member) => {
  let newState = { ...state }
  for (const i of newState[address].groups)
    if (i.address === group)
      i.members = _.uniq([ ...i.members, member ])
  return newState
}

export default groups
