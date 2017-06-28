import {
  registryGetStorePending,
  registryGetStoreSuccess,
  registryGetStoreError
} from '../../../actions'

// SELECT AN ACCOUNT (SHARED)
export const IPFSSTORAGE_SELECT_PENDING = 'IPFSSTORAGE_SELECT_PENDING'
export const IPFSSTORAGE_SELECT_SUCCESS = 'IPFSSTORAGE_SELECT_SUCCESS'
export const IPFSSTORAGE_SELECT_ERROR = 'IPFSSTORAGE_SELECT_ERROR'

export const ipfsStorageSelect = (address, group) => {
  return (dispatch, getState) => {
    dispatch(ipfsStorageSelectPending(address))
    if (getState().IPFSStorage.identities[address]) {
      dispatch(ipfsStorageSelectSuccess(address))
    } else {
      const myaddress = getState().security.address
      dispatch(registryGetStorePending(address))
      contracts.Registry.deployed()
      .then((instance) => {
        return instance.getStore(address, { from: myaddress })
      })
      .then((store) => {
        dispatch(registryGetStoreSuccess(address, store, false))
        dispatch(ipfsStorageSelectSuccess(address))
      })
      .catch((err) => {
        dispatch(registryGetStoreError(address, err))
        dispatch(ipfsStorageSelectError(address, err))
      })
    }
  }
}

const ipfsStorageSelectPending = (address) => ({
  type: IPFSSTORAGE_SELECT_PENDING,
  address
})

const ipfsStorageSelectSuccess = (address) => ({
  type: IPFSSTORAGE_SELECT_SUCCESS,
  address
})

const ipfsStorageSelectError = (address, error) => ({
  type: IPFSSTORAGE_SELECT_ERROR,
  address,
  error
})
