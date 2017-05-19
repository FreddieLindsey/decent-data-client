// Redux store
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import reducers from './reducers'
import {
  accountsInit
} from './actions'

let middleware = (process.env.NODE_ENV !== 'production')
  ? applyMiddleware(thunk, logger())
  : applyMiddleware(thunk)

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducers, {}, composeEnhancer(middleware))

if (module.hot) module.hot.accept('./reducers', () => {
  console.log('HOT RELOADING REDUCERS')
  store.replaceReducer(require('./reducers').default)
})

export default store
