import Request from 'superagent'
import RSAProxyReencrypt from 'rsa-proxy-reencrypt'

// Submitting files to IPFS
export const IPFSSTORAGE_ADD_PENDING = 'IPFSSTORAGE_ADD_PENDING'
export const IPFSSTORAGE_ADD_SUCCESS = 'IPFSSTORAGE_ADD_SUCCESS'
export const IPFSSTORAGE_ADD_ERROR   = 'IPFSSTORAGE_ADD_ERROR'

export const ipfsStorageAdd = (file, address, path) => {
  return (dispatch, getState) => {
    const reader = new FileReader()
    reader.onload = (f) => {
      const publicKey = getState().Registry.identities[address].publicKey.value
      const content = new RSAProxyReencrypt({ rsa: { publicKey } }).encrypt(f.target.result)

      dispatch(ipfsStorageAddPending(path))
      window.ipfs.add([{ path, content }], (err, res) => {
        if (err) {
          dispatch(ipfsStorageAddError(address, path, err))
          return
        }

        const hash = res[0].hash
        const storage = getState().IPFSStorage.identities[address].address
        contracts.IPFSStorage.at(storage)
        .add(path, hash.slice(0, 32), hash.slice(32, 64),
          { from: getState().security.address,
            gas: 3000000, gasPrice: 10000000 })
        .then(() => dispatch(ipfsStorageAddSuccess(address, path, content)))
        .catch((err) => dispatch(ipfsStorageAddError(address, path, err)))
      })
    }
    reader.onerror = (error) => {
      dispatch(ipfsStorageAddError(address, path, error))
    }
    reader.readAsDataURL(file)
  }
}

const ipfsStorageAddPending = (address, path) => {
  return {
    type: IPFSSTORAGE_ADD_PENDING,
    address,
    path
  }
}

const ipfsStorageAddSuccess = (address, path, content) => {
  return {
    type: IPFSSTORAGE_ADD_SUCCESS,
    address,
    path
  }
}

const ipfsStorageAddError = (address, path, error) => {
  return {
    type: IPFSSTORAGE_ADD_ERROR,
    address,
    path,
    error
  }
}
