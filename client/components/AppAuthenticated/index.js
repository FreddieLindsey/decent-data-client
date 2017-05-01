import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'

import PersonalIndexPage from '../PersonalIndexPage'

import styles from './index.scss'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

// Assume the user is authenticated at this point
class AppAuthenticated extends Component {

  static displayName = 'App (Authenticated)'

  render () {
    return (
      <BrowserRouter basename={ '/app' } >
        <div className={ styles.container } >
          <div className='row' >
            <div className='col-xs-3' >
              <div className={ styles.nav } >
                <NavLink
                  to='/'
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkSelected } >
                  Personal
                </NavLink>
                <NavLink
                  to='/shared'
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkSelected } >
                  Shared
                </NavLink>
              </div>
              </div>
              <div className='col-xs-9' >
              <div className={ styles.content }>
                <Switch>
                  <Route exact path='/' component={ PersonalIndexPage } />
                  {/* <Route path='/personal/:path' component={ PersonalViewerPage } /> */}
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(AppAuthenticated)
