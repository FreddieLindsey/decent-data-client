import { combineReducers } from 'redux';

import files from './files'
import { security } from './security'

// Contracts
import * as Contracts from './contracts'

const reducers = combineReducers({
  files,
  security,
  ...Contracts
});

export default reducers;
