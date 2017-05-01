import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import styles from './index.scss'

class PathItem extends Component {

  static displayName = 'Path Item'
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  getExtension = () => {
    const { path } = this.props
    if (path.indexOf('.') === -1)
      return 'TXT'
    let items = path.split('.')
    let ext = items[items.length - 1]
    return ext.toUpperCase()
  }

  render () {
    const {
      path
    } = this.props

    return (
      <div className={ styles.container } >
        <hr className={ styles.separator } />
        <div className='row' >
          <Link
            className={ styles.main }
            to={ '/personal/view/' + path } >
            <div className='col-xs-2' >
              <div className={ styles.logo }>
                { this.getExtension() }
              </div>
            </div>
            <div className='col-xs-8' >
              <div className={ styles.path } >
                { path }
              </div>
            </div>
            <div className='col-xs-2' >
              <button className={ styles.sharing } >
                Sharing
              </button>
            </div>
          </Link>
        </div>
      </div>
    )
  }

}

export default PathItem
