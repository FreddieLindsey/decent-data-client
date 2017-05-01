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
          <div className={ 'row ' + styles.condense } >
            <div className={ 'col-xs-3 ' + styles.noPadLeft } >
              <div className={ styles.nav } >
                <NavLink
                  to='/personal'
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
              <div className={ 'col-xs-9 ' + styles.noPadRight } >
              <div className={ styles.content }>
                <Switch>
                  <Route exact path='/personal' component={ PersonalIndexPage } />
                  {/* <Route path='/personal/view/:path' component={ ViewBlobPage } /> */}
                  {/* <Route path='/personal/share/:path' component={ ShareBlobPage } /> */}
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
