import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'
import Dropzone from 'react-dropzone'

import { Redirect } from 'react-router'

import styles from './index.scss'

import {
  loadPrivateKey,
  accountsChange
} from '../../actions'

const mapStateToProps = (state) => {
  const { error, privateKey } = state.security
  const { all, current } = state.accounts
  return {
    security: {
      error,
      privateKey: !!privateKey
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
      privateKey: PropTypes.bool.isRequired
    }),

    handleLoadPrivateKey: PropTypes.func.isRequired,
    handleAccountsChange: PropTypes.func.isRequired
  }

  renderUnauthenticated = () => {
    const {
      accounts: {
        all,
        current
      },
      security: {
        error,
        privateKey
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
            Upon choosing an account (address), and providing it's correct
            private and public keys, you will be automatically redirected to your account.
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
    const authenticated =
      !!this.props.accounts.current &&
      !!this.props.security.privateKey

    return !authenticated ?
      this.renderUnauthenticated() :
      this.renderAuthenticated()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
