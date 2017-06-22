import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import styles from './Nav.scss'

export default class Nav extends Component {

  render () {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <NavLink to="/" className="navbar-brand" >Private Storage</NavLink>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li>
                <NavLink
                  to="/personal"
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkActive } >
                  Personal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/shared"
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkActive } >
                  Shared
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/upload"
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkActive } >
                  Upload
                </NavLink>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <NavLink
                  to="/accounts"
                  className={ styles.navLink }
                  activeClassName={ styles.navLinkActive } >
                  Accounts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
