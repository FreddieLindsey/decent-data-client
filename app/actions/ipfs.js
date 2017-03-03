import { StringUtil } from '../utils'

// Write file to IPFS
export const IPFS_WRITE_FILE_PENDING = 'IPFS_WRITE_FILE_PENDING'
export const IPFS_WRITE_FILE_SUCCESS = 'IPFS_WRITE_FILE_SUCCESS'
export const IPFS_WRITE_FILE_ERROR   = 'IPFS_WRITE_FILE_ERROR'

export const ipfsWriteFiles = (dispatch, files) => {
  for (const f in files) {
    ipfsWriteFile(dispatch, files[f])
  }
}

const ipfsWriteFile = (dispatch, file) => {
  dispatch(ipfsWriteFilePending())
  const reader = new FileReader()
  reader.onload = (f) => {
    const bytes = StringUtil.toByteArray(f.target.result)
    window.fileContents = window.fileContents || []
    window.fileContents.push(bytes)
  }
  reader.onerror = (e) => {
    console.dir(e)
  }
  reader.readAsText(file)
}

const ipfsWriteFilePending = () => {
  return {
    type: IPFS_WRITE_FILE_PENDING
  }
}

const ipfsWriteFileSuccess = (file) => {
  return {
    type: IPFS_WRITE_FILE_SUCCESS,
    file
  }
}

const ipfsWriteFileError = (error) => {
  return {
    type: IPFS_WRITE_FILE_ERROR,
    error
  }
}
