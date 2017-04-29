import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import {
  loadPrivateKey,
  loadPublicKey
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
      default: state.accounts.default // TODO: Change property != keyword
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadPrivateKey: (key) => dispatch(loadPrivateKey(key)),
    handleLoadPublicKey: (key) => dispatch(loadPublicKey(key))
  }
}

class Authenticate extends Component {

  static displayName = 'Authenticate'
  static propTypes = {
    accounts: PropTypes.shape({
      all: PropTypes.arrayOf(PropTypes.string).isRequired,
      default: PropTypes.string
    }),
    security: PropTypes.shape({
      error: PropTypes.object,
      keys: PropTypes.boolean
    }),

    handleLoadPrivateKey: PropTypes.func.isRequired,
    handleLoadPublicKey: PropTypes.func.isRequired
  }

  render () {
    return (
      <div>
        Authenticate page
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
