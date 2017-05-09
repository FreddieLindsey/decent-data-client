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

import Authenticate from '../AuthenticatePage'
import AppAuthenticated from '../AppAuthenticated'
import NotFound from '../NotFound'

import {
  registryAddStore,
  registryGetStore
} from '../../actions'

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
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={ props =>
        this.props.authenticated ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/authenticate',
            state: { from: props.location }
          }}/>
        )
      }/>
    )

    return (
      <BrowserRouter >
        <Switch>
          <PrivateRoute path='/app' component={ AppAuthenticated } />
          <Redirect exact from='/' to='/app' />
          <Route exact path='/authenticate' component={ Authenticate } />
          <Route component={ NotFound } />
        </Switch>
      </BrowserRouter>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App)
