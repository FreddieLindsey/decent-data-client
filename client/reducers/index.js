import { combineReducers } from 'redux';

import accounts from './accounts'
import files from './files'

// Contracts
import SimpleStorage from './contracts/SimpleStorage'

const reducers = combineReducers({
  accounts,
  files,
  SimpleStorage
});

export default reducers;
