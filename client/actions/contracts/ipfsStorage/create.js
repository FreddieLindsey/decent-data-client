import { Readable } from 'stream'
import request from 'superagent'

import {
  ipfsStorageAddReencryptionKeyPending,
  ipfsStorageAddReencryptionKeySuccess,
  ipfsStorageAddReencryptionKeyError
} from '../../'

// Create a new IPFSStorage contract
export const IPFSSTORAGE_CREATE_PENDING = 'IPFSSTORAGE_CREATE_PENDING'
export const IPFSSTORAGE_CREATE_SUCCESS = 'IPFSSTORAGE_CREATE_SUCCESS'
export const IPFSSTORAGE_CREATE_ERROR = 'IPFSSTORAGE_CREATE_ERROR'
