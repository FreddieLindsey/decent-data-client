// Add Group to Storage
export const IPFSSTORAGE_ADD_GROUP_PENDING = 'IPFSSTORAGE_ADD_GROUP_PENDING'
export const IPFSSTORAGE_ADD_GROUP_SUCCESS = 'IPFSSTORAGE_ADD_GROUP_SUCCESS'
export const IPFSSTORAGE_ADD_GROUP_ERROR   = 'IPFSSTORAGE_ADD_GROUP_ERROR'

export const ipfsStorageAddGroup = (group, name) => {
  return async function(dispatch, getState) {
    const { address } = getState().security
    const storageAddress = getState().IPFSStorage.identities[address].address

    dispatch(ipfsStorageAddGroupPending(address, group, name))
    try {
      const storage = contracts.IPFSStorage.at(storageAddress)
      await storage.addGroup(group, name, { from: address })
      dispatch(ipfsStorageAddGroupSuccess(address, group, name))
    } catch (err) {
      dispatch(ipfsStorageAddGroupError(address, group, name, err))
    }
  }
}

const ipfsStorageAddGroupPending = (address, group, name) => {
  return {
    type: IPFSSTORAGE_ADD_GROUP_PENDING,
    address,
    group,
    name
  }
}

const ipfsStorageAddGroupSuccess = (address, group, name) => {
  return {
    type: IPFSSTORAGE_ADD_GROUP_SUCCESS,
    address,
    group,
    name
  }
}

const ipfsStorageAddGroupError = (address, group, name, error) => {
  return {
    type: IPFSSTORAGE_ADD_GROUP_ERROR,
    address,
    group,
    name,
    error
  }
}
