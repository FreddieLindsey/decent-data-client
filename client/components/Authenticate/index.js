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
          Authenticate page
          <div className={ styles.accounts } >
            <Dropdown
              options={ accountOptions }
              value={ generateOption(current, 0) }
              onChange={ (s) => this.props.handleAccountsChange(s.value) }
            />
          </div>
          <div className={ styles.keys} >
            Keys
          </div>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
