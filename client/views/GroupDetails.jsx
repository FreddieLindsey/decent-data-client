import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './GroupDetails.scss'

import {
  groupGetMembers,
  groupAddMember,
  groupAddReencryptionKey,
  registryGetStore
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  const address = state.security.address
  const group = ownProps.location.search.slice(9)
  if (!address || !group) return { ...ownProps }

  let props = {
    ...ownProps,
    group
  }

  const me = state.groups[address]
  if (me)
    for (let i = 0; i < me.groups.length; i++)
      if (me.groups[i].contract.address === group)
        props.group = { ...me.groups[i] }

  return props
}

const mapDispatchToProps = (dispatch) => ({
  handleGetMembers: (g) => dispatch(groupGetMembers(g)),
  handleAddMember: (g, m) => dispatch(groupAddMember(g, m)),
  handleAddReencryptionKey: (g, m) => dispatch(groupAddReencryptionKey(g, m)),
  handleGetStore: (a) => dispatch(registryGetStore(a))
})

const initialState = {
  add: {
    address: null
  }
}

class GroupDetails extends Component {

  static displayName = 'Group Details'
  static propTypes = {
    group: PropTypes.shape({
      address: PropTypes.string.isRequired,
      contract: PropTypes.any.isRequired,
      members: PropTypes.arrayOf(PropTypes.string).isRequired,
      pending: PropTypes.bool
    }),

    handleGetMembers: PropTypes.func.isRequired,
    handleAddMember: PropTypes.func.isRequired,
    handleAddReencryptionKey: PropTypes.func.isRequired,
    handleGetStore: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { ...initialState }
  }

  componentWillMount () {
    if (this.props.group) this.getCheck(this.props)
  }

  componentWillReceiveProps (props) {
    if (this.props.group) this.getCheck(props)
  }

  getCheck (props) {
    const { group } = props
    if (!group.members && !group.pending)
      this.props.handleGetMembers(group.contract.address)
  }

  handleAddressUpdate (event) {
    const address = event.target.value
    let add = { ...this.state.add, address }
    this.setState({ ...this.state, add })
  }

  handleReset () {
    this.setState({ ...initialState })
  }

  handleSubmit () {
    const { group: { contract } } = this.props
    const { add: { address } } = this.state
    let errors = []

    // CHECK ADDRESS
    if (address.length !== 42) errors.push('Address is not a valid ethereum address')

    if (errors.length > 0)
      this.setState({
        ...this.state,
        add: { ...this.state.add, errors }
      })
    else {
      this.props.handleAddMember(contract.address, address)
      this.props.handleAddReencryptionKey(contract.address, address)
    }
  }

  renderAddMember () {
    return (
      <div className='row'>
        <div className='col-xs-12 col-sm-10' >
          <input
            className={ styles.addInput }
            value={ this.state.add.address || '' }
            onBlur={ (e) => this.props.handleGetStore(e.target.value) }
            onChange={ (e) => this.handleAddressUpdate(e) } />
        </div>
        <div className='col-xs-offset-3 col-sm-offset-0 col-xs-6 col-sm-2' >
          <button
            className={ styles.addButton }
            onClick={ () => this.handleSubmit() } >
            Add
          </button>
        </div>
      </div>
    )
  }

  renderMembers () {
    const { group: { members } } = this.props
    return (
      <table className='table table-striped' >
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {
            members && members.map((member, i) =>
              <tr key={ i } >
                <th scope='row'>{ i + 1 }</th>
                <td>
                  { member }
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }

  render () {
    const { group } = this.props
    return (
      <div>
        <h2>
          Group Details: { group && group.contract.address }
        </h2>
        <hr />
        <h3>
          Members
        </h3>
        { group && this.renderAddMember() }
        { group && this.renderMembers() }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
