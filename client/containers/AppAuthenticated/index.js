import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'

import UploadPage from '../../components/UploadPage'
import PersonalIndexPage from '../../components/PersonalIndexPage'
import SharedIndexPage from '../../components/SharedIndexPage'
import ViewBlobPage from '../../components/ViewBlobPage'
import NotFoundPage from '../NotFoundPage'

import styles from './index.scss'

// Assume the user is authenticated at this point
export default class AppAuthenticated extends Component {

  static displayName = 'App (Authenticated)'

  render () {
    return (
      <BrowserRouter >
        <div className={ styles.container } >
          <div className={ 'row ' + styles.condense } >
            <div className={ 'col-xs-3 ' + styles.noPad } >
              <div className={ styles.nav } >
                <NavLink
                  to='/upload'
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkSelected } >
                  Upload
                </NavLink>
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
            <div className={ 'col-xs-9 ' + styles.noPad } >
              <div className={ styles.content }>
                <Switch>
                  <Route exact path='/upload' component={ UploadPage } />
                  <Route exact path='/personal' component={ PersonalIndexPage } />
                  <Route exact path='/shared' component={ SharedIndexPage } />
                  <Route path='/personal/view' component={ ViewBlobPage } />
                  {/* <Route path='/personal/share' component={ ShareBlobPage } /> */}
                  <Route component={ NotFoundPage } />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    )
  }

}
