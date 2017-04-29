import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'

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
      keys: (!!privateKey && !!publicKey)
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
    }),
    security: PropTypes.shape({
      error: PropTypes.object,
      keys: PropTypes.boolean
    }),

    handleLoadPrivateKey: PropTypes.func.isRequired,
    handleLoadPublicKey: PropTypes.func.isRequired,
    handleAccountsChange: PropTypes.func.isRequired
  }

  render () {
    const {
      accounts: {
        all,
        current
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
              <div className='col-md-6' >
                <div className={ styles.privateKey } >
                  <p className={ styles.privateKeyText } >
                    Private Key
                  </p>
                </div>
              </div>
              <div className='col-md-6' >
                <div className={ styles.publicKey } >
                  <p className={ styles.publicKeyText } >
                    Public Key
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
