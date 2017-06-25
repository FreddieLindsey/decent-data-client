import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'

import UploadPage from '../components/UploadPage'

import ViewBlobPage from '../components/ViewBlobPage'
import ShareBlobPage from '../components/ShareAdminPage'

import Nav from './Nav'

import Home from '../views/Home'
import Personal from '../views/Personal'
import Shared from '../views/Shared'
import Accounts from '../views/Accounts'
import Groups from '../views/Groups'
import GroupDetails from '../views/GroupDetails'
import NotFound from '../views/NotFound'

import styles from './App.scss'

import {
  getAccounts
} from '../actions'

const mapStateToProps = (state) => ({})
const mapDispatchToProps = (dispatch) => ({
  handleGetAccounts: () => dispatch(getAccounts())
})

class App extends Component {

  static displayName = 'App (Authenticated)'
  static propTypes = {
    handleGetAccounts: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.handleGetAccounts()
  }

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
                <Route exact path='/personal' component={ Personal } />
                <Route exact path='/groups' component={ Groups } />
                <Route path='/groups/details' component={ GroupDetails } />
                <Route exact path='/upload' component={ UploadPage } />
                <Route exact path='/shared' component={ Shared } />
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
