import { combineReducers } from 'redux';

import accounts from './accounts'
import files from './files'
import { security } from './security'

// Contracts
import * as Contracts from './contracts'

const reducers = combineReducers({
  accounts,
  files,
  security,
  ...Contracts
});

export default reducers;
