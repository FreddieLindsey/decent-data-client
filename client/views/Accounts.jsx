import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Select from 'react-select'
import toastr from 'toastr'

import {
  selectAccount,
  getAccounts,
} from '../actions'

const mapStateToProps = (state) => ({
  address: state.security.address,
  accounts: state.security.accounts
})

const mapDispatchToProps = (dispatch) => ({
  handleSelectAccount: (a) => dispatch(selectAccount(a)),
  handleGetAccounts: () => dispatch(getAccounts())
})

class Accounts extends Component {

  static propTypes = {
    address: PropTypes.string,
    accounts: PropTypes.arrayOf(PropTypes.string).isRequired,

    handleSelectAccount: PropTypes.func.isRequired,
    handleGetAccounts: PropTypes.func.isRequired
  }

  renderAccountSelector () {
    const { address: selected, accounts } = this.props
    const accountOptions = accounts.map(a => ({ label: a, value: a }))

    return (
      <Select
        name={ 'Select account' }
        value={ selected }
        options={ accountOptions }
        onChange={ (v) => {
          const newValue =
            v && v.value || accounts.length > 0 && accounts[0] || null
          if (!v)
            (accounts.length > 0) ?
              toastr.warning('You tried to select no account. ' +
                             'Since you have accounts available, this is not possible. ' +
                             'Selecting default account') :
              toastr.error('You cannot have no account selected!')
          this.props.handleSelectAccount(newValue)
        } }
      />
    )
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
        { this.renderAccountSelector() }
        { this.renderAccountList() }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
