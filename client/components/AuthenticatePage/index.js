import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'
import Dropzone from 'react-dropzone'

import { Redirect } from 'react-router'

import styles from './index.scss'

import {
  loadPrivateKey,
  loadPublicKey,
  accountsChange
} from '../../actions'

const mapStateToProps = (state) => {
  const { error, privateKey, publicKey } = state.security
  const { all, current } = state.accounts
  return {
    security: {
      error,
      privateKey: !!privateKey,
      publicKey: !!publicKey
    },
    accounts: {
      all,
      current
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadPrivateKey: (key) => dispatch(loadPrivateKey(key)),
    handleLoadPublicKey: (key) => dispatch(loadPublicKey(key)),
    handleAccountsChange: (v) => dispatch(accountsChange(v))
  }
}

class Authenticate extends Component {

  static displayName = 'Authenticate'
  static propTypes = {
    accounts: PropTypes.shape({
      all: PropTypes.arrayOf(PropTypes.string).isRequired,
      current: PropTypes.string.isRequired
    }).isRequired,
    security: PropTypes.shape({
      error: PropTypes.object,
      privateKey: PropTypes.bool.isRequired,
      publicKey: PropTypes.bool.isRequired
    }),

    handleLoadPrivateKey: PropTypes.func.isRequired,
    handleLoadPublicKey: PropTypes.func.isRequired,
    handleAccountsChange: PropTypes.func.isRequired
  }

  renderPrivateKey (only = false) {
    return (
      <div className={ only ? 'col-md-6 col-md-offset-3' : 'col-md-6'  } >
        <Dropzone
          className={ styles.privateKey }
          onDrop={ (f) => this.props.handleLoadPrivateKey(f) } >
          <p className={ styles.privateKeyText } >
            Private Key
          </p>
        </Dropzone>
      </div>
    )
  }

  renderPublicKey (only = false) {
    return (
      <div className={ only ? 'col-md-6 col-md-offset-3' : 'col-md-6'  } >
        <Dropzone
          className={ styles.publicKey }
          onDrop={ (f) => this.props.handleLoadPublicKey(f) } >
          <p className={ styles.publicKeyText } >
            Public Key
          </p>
        </Dropzone>
      </div>
    )
  }

  renderUnauthenticated = () => {
    const {
      accounts: {
        all,
        current
      },
      security: {
        privateKey,
        publicKey
      }
    } = this.props

    const generateOption = (a) => ({ value: a, label: a })
    const accountOptions = all.map(generateOption)

    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          <h2 className={ styles.title }>
            Please authenticate yourself
          </h2>
          <p className={ styles.description } >
            On choosing an account and providing the correct
            private and public keys, you will gain access to manage the account.
          </p>
          <hr />
          <div className={ styles.accounts } >
            <Dropdown
              options={ accountOptions }
              value={ generateOption(current) }
              onChange={ (s) => this.props.handleAccountsChange(s.value) }
            />
          </div>
          <div className={ styles.keys } >
            <div className='row' >
              { !privateKey && this.renderPrivateKey(publicKey) }
              { !publicKey && this.renderPublicKey(privateKey) }
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderAuthenticated = () =>
    <Redirect to={{
      pathname: '/',
      state: { from: '/authenticate' }
    }}/>

  render () {
    const authenticated =
      !!this.props.accounts.current &&
      !!this.props.security.privateKey &&
      !!this.props.security.publicKey

    return !authenticated ? this.renderUnauthenticated() : this.renderAuthenticated()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
