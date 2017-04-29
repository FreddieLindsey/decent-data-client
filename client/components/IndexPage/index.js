import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

import {
} from '../../actions'

const mapStateToProps = (state) => {
  return {
    account: state.accounts.current
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class Index extends Component {

  static displayName = 'Index'
  static propTypes = {
    account: PropTypes.string.isRequired
  }

  render () {
    const {
      account
    } = this.props

    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          { account }
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
