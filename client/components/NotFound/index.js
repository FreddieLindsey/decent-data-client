import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'

import styles from './index.scss'

class NotFound extends Component {

  static displayName = 'Not Found'

  render () {
    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          <h1 className={ styles.number } >
            404
          </h1>
          <h2 className={ styles.text } >
            Ooops! I can't find a page with this URL.
          </h2>
          <hr />
          <Link 
            className={ styles.link }
            to={{ pathname: '/', state: { from: '/notfound' }}} >
            Click here to return to the application
          </Link>
        </div>
      </div>
    )
  }

}

export default NotFound
