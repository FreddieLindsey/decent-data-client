// Give write to a path
export const IPFSSTORAGE_GIVE_WRITE_PENDING = 'IPFSSTORAGE_GIVE_WRITE_PENDING'
export const IPFSSTORAGE_GIVE_WRITE_SUCCESS = 'IPFSSTORAGE_GIVE_WRITE_SUCCESS'
export const IPFSSTORAGE_GIVE_WRITE_ERROR = 'IPFSSTORAGE_GIVE_WRITE_ERROR'

export const ipfsStorageGiveWrite = (address, path) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.identities[identity].address
    dispatch(ipfsStorageGiveWritePending(identity, address, path))
    contracts.IPFSStorage.at(storage)
    .giveWrite(address, path, { from: identity, gas: 3000000, gasPrice: 1000000000 })
    .then(() => dispatch(ipfsStorageGiveWriteSuccess(identity, address, path)))
    .catch((err) => dispatch(ipfsStorageGiveWriteError(identity, address, path, err)))
  }
}

const ipfsStorageGiveWritePending = (identity, address, path) => ({
  type: IPFSSTORAGE_GIVE_WRITE_PENDING,
  identity,
  address,
  path
})

const ipfsStorageGiveWriteSuccess = (identity, address, path) => ({
  type: IPFSSTORAGE_GIVE_WRITE_SUCCESS,
  identity,
  address,
  path
})

const ipfsStorageGiveWriteError = (identity, address, path, error) => ({
  type: IPFSSTORAGE_GIVE_WRITE_ERROR,
  identity,
  address,
  path,
  error
})
