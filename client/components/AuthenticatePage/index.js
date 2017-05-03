import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'
import Dropzone from 'react-dropzone'

import { Redirect } from 'react-router'

import styles from './index.scss'

import {
  loadECDSAPrivateKey
} from '../../actions'

const mapStateToProps = (state) => {
  const { address, error } = state.security
  return {
    authenticated: !!address,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadPrivateKey: (key) => dispatch(loadECDSAPrivateKey(key))
  }
}

class Authenticate extends Component {

  static displayName = 'Authenticate'
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    error: PropTypes.object,

    handleLoadPrivateKey: PropTypes.func.isRequired
  }

  renderUnauthenticated = () => {
    const {
      error
    } = this.props

    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          <h2 className={ styles.title }>
            Please authenticate yourself by providing your private key
          </h2>
          <hr />
          <div className={ styles.keys } >
            <div className='row' >
              <div className={ 'col-xs-12' } >
                <Dropzone
                  className={ styles.privateKey }
                  onDrop={ (f) => this.props.handleLoadPrivateKey(f) } >
                  <p className={ styles.privateKeyText } >
                    Private Key
                  </p>
                </Dropzone>
              </div>
            </div>
            {
              error &&
              <p className={ styles.keyError } >
                { error.toString() }
              </p>
            }
          </div>
        </div>
      </div>
    )
  }

  renderAuthenticated = () =>
    <Redirect to={{
      pathname: '/app/personal',
      state: { from: '/authenticate' }
    }}/>

  render () {
    return this.props.authenticated ?
      this.renderAuthenticated() :
      this.renderUnauthenticated()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
