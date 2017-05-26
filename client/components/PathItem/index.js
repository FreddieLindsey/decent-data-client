import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import styles from './index.scss'

class PathItem extends Component {

  static displayName = 'Path Item'
  static propTypes = {
    address: PropTypes.string,
    share: PropTypes.bool.isRequired,
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
      address,
      share,
      path
    } = this.props

    return (
      <div className={ styles.container } >
        <hr className={ styles.separator } />
        <div className='row' >
          <Link
            className={ styles.main }
            to={ share ?
                  '/personal/view?' + path :
                  '/shared/view/' + address + '/' + path } >
            <div className='col-xs-2' >
              <div className={ styles.logo }>
                { this.getExtension() }
              </div>
            </div>
            <div className={ share ? 'col-xs-8' : 'col-xs-10' } >
              <div className={ styles.path } >
                { path }
              </div>
            </div>
          </Link>
          {
            share &&
            <div className='col-xs-2' >
              <Link
                to={ '/personal/share/' + path } >
                <button
                  className={ styles.sharing } >
                  Share
                </button>
              </Link>
            </div>
          }
        </div>
      </div>
    )
  }

}

export default PathItem
