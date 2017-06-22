import React, { Component, PropTypes } from 'react'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'

import UploadPage from '../components/UploadPage'
import SharedIndexPage from '../components/SharedIndexPage'

import ViewBlobPage from '../components/ViewBlobPage'
import ShareBlobPage from '../components/ShareAdminPage'

import Nav from './Nav'

import Home from '../views/Home'
import Personal from '../views/Personal'
import Accounts from '../views/Accounts'
import NotFound from '../views/NotFound'

import styles from './App.scss'

export default class App extends Component {

  static displayName = 'App (Authenticated)'

  render () {
    return (
      <BrowserRouter >
        <div className={ styles.container } >
          <Nav />
          <div className='container' >
            <div className={ styles.content }>
              <Switch>
                <Route exact path='/' component={ Home } />
                <Route exact path='/accounts' component={ Accounts } />
                <Route exact path='/upload' component={ UploadPage } />
                <Route exact path='/personal' component={ Personal } />
                <Route exact path='/shared' component={ SharedIndexPage } />
                <Route path='/personal/share' component={ ShareBlobPage } />
                <Route path='/personal/view' component={ ViewBlobPage } />
                <Route path='/shared/view' component={ ViewBlobPage } />
                <Route component={ NotFound } />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    )
  }

}
