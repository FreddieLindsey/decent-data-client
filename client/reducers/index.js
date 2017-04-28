import { combineReducers } from 'redux';

import accounts from './accounts'
import files from './files'
import { security } from './security'

// Contracts
import {
  IPFSStorage
} from './contracts'

const reducers = combineReducers({
  accounts,
  files,
  security,
  IPFSStorage
});

export default reducers;
