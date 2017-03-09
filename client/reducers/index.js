import { combineReducers } from 'redux';

import accounts from './accounts'
import files from './files'

// Contracts
import SimpleStorage from './contracts/SimpleStorage'
import IPFSStorage from './contracts/IPFSStorage'

const reducers = combineReducers({
  accounts,
  files,
  SimpleStorage,
  IPFSStorage
});

export default reducers;
