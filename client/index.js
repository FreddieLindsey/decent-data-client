// Import the page's CSS. Webpack will know what to do with it.
import './style/app.css'
import './style/dropdown.global.css'

import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

import './init'

import store from './store'

import { AppContainer } from 'react-hot-loader'
import App from './containers/App'

const renderer = (Component) => {
  render(
    <AppContainer >
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  )
}

renderer(App)
if (module.hot)
  module.hot.accept('./containers/App', () => {
    console.log('HOT RELOADING VIEW')
    renderer(require('./containers/App').default)
  })
