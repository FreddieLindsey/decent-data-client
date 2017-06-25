import { combineReducers } from 'redux';

import files from './files'
import { security } from './security'
import groups from './groups'

// Contracts
import * as Contracts from './contracts'

const reducers = combineReducers({
  files,
  security,
  groups,
  ...Contracts
});

export default reducers;
