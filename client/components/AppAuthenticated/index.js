import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import IndexPage from '../IndexPage'

import NotFound from '../NotFound'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

// Assume the user is authenticated at this point
class AppAuthenticated extends Component {

  static displayName = 'App (Authenticated)'

  render () {
    return (
      <BrowserRouter basename={ '/app' } >
        <Switch>
          <Route exact path='/' component={ IndexPage } />
          <Route component={ NotFound } />
        </Switch>
      </BrowserRouter>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(AppAuthenticated)
