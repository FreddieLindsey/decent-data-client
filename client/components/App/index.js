import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  BrowserRouter,
  Redirect,
  Route
} from 'react-router-dom'

import Authenticate from '../AuthenticatePage'
import Index from '../IndexPage'
import NotFound from '../NotFound'

import {
  ipfsStorageAddressGet,
} from '../../actions'

const mapStateToProps = (state) => {
  const {
    privateKey, publicKey
  } = state.security
  const { current } = state.accounts
  return {
    authenticated: (!!current && !!privateKey && !!publicKey)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleAddressGet: () => dispatch(ipfsStorageAddressGet()),
  }
}

class App extends Component {

  static displayName = 'App'
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    handleAddressGet: PropTypes.func.isRequired,
  }

  componentDidMount () {
    this.props.handleAddressGet()
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
        <div>
          <PrivateRoute exact path='/' component={ Index } />
          <Route exact path='/authenticate' component={ Authenticate } />
          <Route path='*' component={ NotFound } />
        </div>
      </BrowserRouter>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App)
