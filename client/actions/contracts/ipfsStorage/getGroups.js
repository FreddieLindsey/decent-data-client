// Get Groups in Storage
export const IPFSSTORAGE_GET_GROUPS_PENDING = 'IPFSSTORAGE_GET_GROUPS_PENDING'
export const IPFSSTORAGE_GET_GROUPS_SUCCESS = 'IPFSSTORAGE_GET_GROUPS_SUCCESS'
export const IPFSSTORAGE_GET_GROUPS_ERROR   = 'IPFSSTORAGE_GET_GROUPS_ERROR'

export const ipfsStorageGetGroups = () => {
  return async function(dispatch, getState) {
    const { address } = getState().security
    const storageAddress = getState().IPFSStorage.identities[address].address

    dispatch(ipfsStorageGetGroupsPending(address))
    try {
      const storage = contracts.IPFSStorage.at(storageAddress)
      const size = await storage.getGroupsSize({ from: address })
      console.log(size)
      let groups = []
      for (let i = 0; i < size; i++) {
        const [ address, name, ..._ ] = await storage.getGroup(i)
        groups.push({ name, address })
      }
      dispatch(ipfsStorageGetGroupsSuccess(address, groups))
    } catch (err) {
      dispatch(ipfsStorageGetGroupsError(address, err))
    }
  }
}

const ipfsStorageGetGroupsPending = (address) => {
  return {
    type: IPFSSTORAGE_GET_GROUPS_PENDING,
    address
  }
}

const ipfsStorageGetGroupsSuccess = (address, groups) => {
  return {
    type: IPFSSTORAGE_GET_GROUPS_SUCCESS,
    address,
    groups
  }
}

const ipfsStorageGetGroupsError = (address, error) => {
  return {
    type: IPFSSTORAGE_GET_GROUPS_ERROR,
    address,
    error
  }
}
