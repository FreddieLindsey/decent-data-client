// Give write to a path
export const IPFSSTORAGE_GIVE_WRITE_GROUP_PENDING = 'IPFSSTORAGE_GIVE_WRITE_GROUP_PENDING'
export const IPFSSTORAGE_GIVE_WRITE_GROUP_SUCCESS = 'IPFSSTORAGE_GIVE_WRITE_GROUP_SUCCESS'
export const IPFSSTORAGE_GIVE_WRITE_GROUP_ERROR = 'IPFSSTORAGE_GIVE_WRITE_GROUP_ERROR'

export const ipfsStorageGiveWriteGroup = (group, path) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.mine
    dispatch(ipfsStorageGiveWriteGroupPending(identity, group, path))
    contracts.IPFSStorage.at(storage)
    .giveWriteGroup(group, path, { from: identity })
    .then(() => dispatch(ipfsStorageGiveWriteGroupSuccess(identity, group, path)))
    .catch((err) => dispatch(ipfsStorageGiveWriteGroupError(identity, group, path, error)))
  }
}

const ipfsStorageGiveWriteGroupPending = (identity, group, path) => ({
  type: IPFSSTORAGE_GIVE_WRITE_GROUP_PENDING,
  identity,
  group,
  path
})

const ipfsStorageGiveWriteGroupSuccess = (identity, group, path) => ({
  type: IPFSSTORAGE_GIVE_WRITE_GROUP_SUCCESS,
  identity,
  group,
  path
})

const ipfsStorageGiveWriteGroupError = (identity, group, path, error) => ({
  type: IPFSSTORAGE_GIVE_WRITE_GROUP_ERROR,
  identity,
  group,
  path,
  error
})
