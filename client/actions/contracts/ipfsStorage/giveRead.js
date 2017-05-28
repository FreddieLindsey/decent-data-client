// Give write to a path
export const IPFSSTORAGE_GIVE_READ_PENDING = 'IPFSSTORAGE_GIVE_READ_PENDING'
export const IPFSSTORAGE_GIVE_READ_SUCCESS = 'IPFSSTORAGE_GIVE_READ_SUCCESS'
export const IPFSSTORAGE_GIVE_READ_ERROR = 'IPFSSTORAGE_GIVE_READ_ERROR'

export const ipfsStorageGiveRead = (address, path) => {
  return (dispatch, getState) => {
    const identity = getState().security.address
    const storage = getState().IPFSStorage.mine
    dispatch(ipfsStorageGiveReadPending(identity, address, path))
    contracts.IPFSStorage.at(storage)
    .giveRead(address, path, { from: identity, gas: 3000000, gasPrice: 10000000 })
    .then(() => dispatch(ipfsStorageGiveReadSuccess(identity, address, path)))
    .catch((err) => dispatch(ipfsStorageGiveReadError(identity, address, path, err)))
  }
}

const ipfsStorageGiveReadPending = (identity, address, path) => ({
  type: IPFSSTORAGE_GIVE_READ_PENDING,
  identity,
  address,
  path
})

const ipfsStorageGiveReadSuccess = (identity, address, path) => ({
  type: IPFSSTORAGE_GIVE_READ_SUCCESS,
  identity,
  address,
  path
})

const ipfsStorageGiveReadError = (identity, address, path, error) => ({
  type: IPFSSTORAGE_GIVE_READ_ERROR,
  identity,
  address,
  path,
  error
})
