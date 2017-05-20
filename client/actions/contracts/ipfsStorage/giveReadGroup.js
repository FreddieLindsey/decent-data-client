// Give write to a path
export const IPFSSTORAGE_GIVE_READ_GROUP_PENDING = 'IPFSSTORAGE_GIVE_READ_GROUP_PENDING'
export const IPFSSTORAGE_GIVE_READ_GROUP_SUCCESS = 'IPFSSTORAGE_GIVE_READ_GROUP_SUCCESS'
export const IPFSSTORAGE_GIVE_READ_GROUP_ERROR = 'IPFSSTORAGE_GIVE_READ_GROUP_ERROR'

export const ipfsStorageGiveReadGroup = (group, path) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.mine
    dispatch(ipfsStorageGiveReadGroupPending(identity, group, path))
    contracts.IPFSStorage.at(storage)
    .giveReadGroup(group, path, { from: identity, gas: 3000000, gasPrice: 10000000 })
    .then(() => dispatch(ipfsStorageGiveReadGroupSuccess(identity, group, path)))
    .catch((err) => dispatch(ipfsStorageGiveReadGroupError(identity, group, path, err)))
  }
}

const ipfsStorageGiveReadGroupPending = (identity, group, path) => ({
  type: IPFSSTORAGE_GIVE_READ_GROUP_PENDING,
  identity,
  group,
  path
})

const ipfsStorageGiveReadGroupSuccess = (identity, group, path) => ({
  type: IPFSSTORAGE_GIVE_READ_GROUP_SUCCESS,
  identity,
  group,
  path
})

const ipfsStorageGiveReadGroupError = (identity, group, path, error) => ({
  type: IPFSSTORAGE_GIVE_READ_GROUP_ERROR,
  identity,
  group,
  path,
  error
})
