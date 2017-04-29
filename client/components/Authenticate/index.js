import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'
import Dropzone from 'react-dropzone'

import styles from './index.scss'

import {
  loadPrivateKey,
  loadPublicKey,
  accountsChange
} from '../../actions'

const mapStateToProps = (state) => {
  const { error, privateKey, publicKey } = state.security
  const { all } = state.accounts
  return {
    security: {
      error,
      keys: {
        privateKey: !!privateKey,
        publicKey: !!publicKey
      }
    },
    accounts: {
      all,
      current: state.accounts.default // TODO: Change property != keyword
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
      current: PropTypes.string
    }).isRequired,
    security: PropTypes.shape({
      error: PropTypes.object,
      keys: PropTypes.shape({
        privateKey: PropTypes.boolean,
        publicKey: PropTypes.boolean
      }).isRequired
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

  render () {
    const {
      accounts: {
        all,
        current
      },
      security: {
        keys: {
          privateKey,
          publicKey
        }
      }
    } = this.props

    const generateOption = (a, i) => ({ value: a, label: a, index: i })
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
              value={ generateOption(current, 0) }
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

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
