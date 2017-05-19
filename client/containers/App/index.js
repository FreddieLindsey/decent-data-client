import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// TODO: Shouldn't be here, works at the moment
import ipfsApi from 'ipfs-api'
window.ipfs = ipfsApi('localhost', 5001)

import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'

import Authenticate from '../../components/AuthenticatePage'
import AppAuthenticated from '../AppAuthenticated'

const mapStateToProps = (state) => {
  const {
    security: { address },
    Registry: { store: { retrieved } }
  } = state
  return {
    authenticated: !!address && !!retrieved
  }
}

const mapDispatchToProps = (dispatch) => ({})

class App extends Component {

  static displayName = 'App'
  static propTypes = {
    authenticated: PropTypes.bool.isRequired
  }

  render () {
    const { authenticated } = this.props

    return (
      <BrowserRouter >
        <Switch>
          <Route exact path='/authenticate' component={ Authenticate } />
          {
            authenticated ?
            <Route path='/' component={ AppAuthenticated } /> :
            <Redirect to='/authenticate' />
          }
        </Switch>
      </BrowserRouter>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App)
