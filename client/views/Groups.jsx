import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './Groups.scss'

import {
  registryCreateGroup
} from '../actions'

const mapStateToProps = (state) => {
  let address = state.security.address
  return address ?
  {
    address,
    pending: state.groups[state.security.address].pending || false,
    groups: [ ...state.groups[state.security.address].groups ]
  } : {}
}

const mapDispatchToProps = (dispatch) => ({
  handleCreate: (a) => dispatch(registryCreateGroup(a))
})

class Groups extends Component {

  static displayName = 'Groups'
  static propTypes = {
    address: PropTypes.string,
    pending: PropTypes.bool.isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
      address: PropTypes.string.isRequired
    })),

    handleCreate: PropTypes.func.isRequired
  }

  renderGroups () {
    const { groups } = this.props
    return (
      <table className='table table-striped' >
        <thead>
          <tr>
            <th>#</th>
            <th>Group Address</th>
          </tr>
        </thead>
        <tbody>
          {
            groups && groups.map((g, i) =>
              <tr key={ i } >
                <th scope='row'>{ i + 1 }</th>
                <td>{ g.address }</td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }

  render () {
    const { address } = this.props
    return (
      <div>
        <div className='row' >
          <div className='col-xs-10' >
            <h3>
              Your Groups
            </h3>
          </div>
          <div className='col-xs-2' >
            <button className={ styles.create } onClick={ () => this.props.handleCreate(address) } >
              Create
            </button>
          </div>
        </div>
        { this.renderGroups() }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Groups)
