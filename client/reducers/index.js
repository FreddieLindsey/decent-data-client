import { combineReducers } from 'redux';

import accounts from './accounts'
import files from './files'

// Contracts
import {
  IPFSStorage
} from './contracts'

const reducers = combineReducers({
  accounts,
  files,
  IPFSStorage
});

export default reducers;
