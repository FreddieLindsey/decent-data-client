// Redux store
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

// Persist store
import localForage from 'localforage'
import { persistStore, autoRehydrate } from 'redux-persist'
import { REHYDRATE } from 'redux-persist/constants'
import createActionBuffer from 'redux-action-buffer'

import reducers from './reducers'
import {
  accountsInit
} from './actions'

let middleware = (process.env.NODE_ENV !== 'production')
  ? applyMiddleware(thunk, logger(),
                    createActionBuffer(REHYDRATE))
  : applyMiddleware(thunk,
                    createActionBuffer(REHYDRATE))

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducers, undefined,
  composeEnhancer(
    middleware,
    autoRehydrate()
  ))

// Persist store to storage
persistStore(store, { storage: localForage })

if (module.hot) module.hot.accept('./reducers', () => {
  console.log('HOT RELOADING REDUCERS')
  store.replaceReducer(require('./reducers').default)
})

export default store
