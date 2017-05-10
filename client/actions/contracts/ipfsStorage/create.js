import { Readable } from 'stream'

// Create a new IPFSStorage contract
export const IPFSSTORAGE_CREATE_PENDING = 'IPFSSTORAGE_CREATE_PENDING'
export const IPFSSTORAGE_CREATE_SUCCESS = 'IPFSSTORAGE_CREATE_SUCCESS'
export const IPFSSTORAGE_CREATE_ERROR = 'IPFSSTORAGE_CREATE_ERROR'

export const ipfsStorageCreate = () => {
  return (dispatch, getState) => {
    const { address, ecdsa: { publicKey } } = getState().security
    const content = new Buffer(publicKey)
    dispatch(ipfsStorageCreatePending())
    ipfs.add([
      {
        path: 'publicKey.pem',
        content
      }
    ], (err, res) => {
      if (err) {
        dispatch(ipfsStorageCreateError(err))
      } else {
        const hash = res[0].hash
        contracts.IPFSStorage.new(
          hash.slice(0, 32), hash.slice(32, 64), {
            from: address, gas: 3000000, gasPrice: 10000000
          }
        )
        .then((instance) => dispatch(ipfsStorageCreateSuccess(instance.address)))
        .catch((err) => dispatch(ipfsStorageCreateError(err)))
      }
    })
  }
}

const ipfsStorageCreatePending = () => ({
  type: IPFSSTORAGE_CREATE_PENDING
})

const ipfsStorageCreateSuccess = (address) => ({
  type: IPFSSTORAGE_CREATE_SUCCESS,
  address
})

const ipfsStorageCreateError = (error) => ({
  type: IPFSSTORAGE_CREATE_ERROR,
  error
})
