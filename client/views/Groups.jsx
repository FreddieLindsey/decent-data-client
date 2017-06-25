import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import styles from './Groups.scss'

import {
  registryCreateGroup,
  registryGetGroups
} from '../actions'

const mapStateToProps = (state) => {
  let { address } = state.security
  return address ?
  {
    address,
    pending: state.groups[state.security.address].pending,
    groups: [ ...state.groups[state.security.address].groups ]
  } : {}
}

const mapDispatchToProps = (dispatch) => ({
  handleCreate: () => dispatch(registryCreateGroup()),
  handleGetGroups: () => dispatch(registryGetGroups())
})

class Groups extends Component {

  static displayName = 'Groups'
  static propTypes = {
    address: PropTypes.string,
    pending: PropTypes.bool,
    groups: PropTypes.arrayOf(PropTypes.shape({
      address: PropTypes.string.isRequired
    })),

    handleCreate: PropTypes.func.isRequired,
    handleGetGroups: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.address && this.props.handleGetGroups()
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
                <td>
                  <NavLink to={ `/groups/details?address=${g.address}` } >
                    { g.address }
                  </NavLink>
                </td>
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
        <div className='row' >
          <div className='col-xs-10' >
            <h3>
              Your Groups
            </h3>
          </div>
          <div className='col-xs-2' >
            <button className={ styles.create } onClick={ () => this.props.handleCreate() } >
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
