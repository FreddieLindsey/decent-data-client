import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  getAccounts
} from '../actions'

const mapStateToProps = (state) => ({
  accounts: state.security.accounts
})

const mapDispatchToProps = (dispatch) => ({
  handleGetAccounts: () => dispatch(getAccounts())
})

class Accounts extends Component {

  static propTypes = {
    accounts: PropTypes.arrayOf(PropTypes.string).isRequired,

    handleGetAccounts: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.handleGetAccounts()
  }

  renderAccountList () {
    const { accounts } = this.props

    return (
      <table className='table' >
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {
            accounts.map((a, i) =>
              <tr key={ i } >
                <th scope='row'>{ i + 1 }</th>
                <td>{ a }</td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }

  render () {
    return (
      <div>
        { this.renderAccountList() }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
