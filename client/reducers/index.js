import { combineReducers } from 'redux';

import accounts from './accounts'
import files from './files'
import ipfs from './ipfs'

// Contracts
import SimpleStorage from './contracts/SimpleStorage'

const reducers = combineReducers({
  accounts,
  files,
  ipfs,
  SimpleStorage
});

export default reducers;
