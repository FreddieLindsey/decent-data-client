import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  ipfsStorageAddGroup
} from '../actions'

import styles from './AddGroup.scss'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  handleAddGroup: (a, n) => dispatch(ipfsStorageAddGroup(a, n))
})

const initialState = {
  add: {
    name: '',
    address: '',
    errors: []
  }
}

class AddGroup extends Component {

  static displayName = 'Add Group'
  static propTypes = {
    handleAddGroup: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { ...initialState }
  }

  handleNameUpdate (event) {
    const name = event.target.value
    let add = { ...this.state.add, name }
    this.setState({ ...this.state, add })
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
    const { add: { address, name } } = this.state
    let errors = []

    // CHECK ADDRESS
    if (address.indexOf('0x') !== 0 && address.length !== 42)
      errors.push('Address is not a valid ethereum address')
    if (name.length === 0)
      errors.push('Name can\'t be blank')

    if (errors.length > 0)
      this.setState({
        ...this.state,
        add: { ...this.state.add, errors }
      })
    else
      this.props.handleAddGroup(address, name)
  }

  render () {
    const { add: { name, address, errors } } = this.state

    return (
      <div>
        <h4 className={ styles.titleUpdate } >
          Add Group
        </h4>
        <div className='row' >
          {/* ADD GROUP */}
          <div className='col-xs-12' >
            <input
              className={ styles.addressInput }
              placeholder='Enter name'
              value={ name }
              onChange={ (e) => this.handleNameUpdate(e) }
            />
          </div>
          <div className='col-xs-12' >
            <input
              className={ styles.addressInput }
              placeholder='Enter address'
              value={ address }
              onChange={ (e) => this.handleAddressUpdate(e) }
            />
          </div>
          {
            errors.length > 0 &&
            <div className='col-xs-12' >
              <div className={ styles.errors } >
                <h5>Errors:</h5>
                <ul>
                  { errors.map((e) => <li key={e}>{e}</li>) }
                </ul>
              </div>
            </div>
          }
          <div className='col-xs-6' >
            <button
              className={ styles.clear }
              onClick={ () => this.handleReset() } >
              Clear
            </button>
          </div>
          <div className='col-xs-6' >
            <button
              className={ styles.submit }
              onClick={ () => this.handleSubmit() } >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(AddGroup)
