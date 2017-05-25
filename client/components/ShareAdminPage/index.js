import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  ipfsStorageSizeShareGet,
  ipfsStorageGiveRead,
  ipfsStorageGiveWrite,
  ipfsStorageIndexShareGet,
} from '../../actions'

import styles from './index.scss'

import PermissionsList from '../PermissionsList'

const mapStateToProps = (state, props) => {
  const identity = state.security.address
  const path = props.match.params.path
  const sharing = state.files.stored[`${identity}/${path}`].sharing
  return  {
    identity,
    path,
    sharing
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleSizeShareGet: (p) => dispatch(ipfsStorageSizeShareGet(p)),
  handleGiveRead: (a, p) => dispatch(ipfsStorageGiveRead(a, p)),
  handleGiveWrite: (a, p) => dispatch(ipfsStorageGiveWrite(a, p)),
  handleIndexSharedGet: (p, i) => dispatch(ipfsStorageIndexShareGet(p, i))
})

const initialState = {
  add: {
    address: '',
    errors: [],
    permissions: 0,
    type: 0
  }
}

class ShareAdminPage extends Component {

  static displayName = 'Share Admin Page'
  static propTypes = {
    identity: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    sharing: PropTypes.shape({
      parties: PropTypes.object.isRequired,
      size: PropTypes.number.isRequired
    }).isRequired,

    handleSizeShareGet: PropTypes.func.isRequired,
    handleGiveRead: PropTypes.func.isRequired,
    handleGiveWrite: PropTypes.func.isRequired,
    handleIndexSharedGet: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = { ...initialState }
  }

  componentWillMount () {
    this.handleCheck(this.props)
  }

  componentWillReceiveProps (props) {
    this.handleCheck(props)
  }

  handleCheck (props) {
    props.handleSizeShareGet(props.path)
    const { size, parties } = props.sharing
    const party_size = Object.keys(parties).length
    if (size > 0 && party_size < size)
      for (let i = 0; i < size; i++)
        if (!parties[i])
          props.handleIndexSharedGet(props.path, i)
  }

  handleAddressUpdate (event) {
    const address = event.target.value
    let add = { ...this.state.add, address }
    this.setState({ ...this.state, add })
  }

  handleChangeType (type) {
    this.setState({
      ...this.state,
      add: { ...this.state.add, type }
    })
  }

  handleToggleRead () {
    let permissions = this.state.add.permissions
    permissions % 2 === 1 ?
      permissions -= 1 :
      permissions += 1
    this.setState({
      ...this.state,
      add: { ...this.state.add, permissions }
    })
  }

  handleToggleWrite () {
    let permissions = this.state.add.permissions
    permissions % 4 >= 2 ?
      permissions -= 2 :
      permissions += 2
    this.setState({
      ...this.state,
      add: { ...this.state.add, permissions }
    })
  }

  handleReset () {
    this.setState({ ...initialState })
  }

  handleSubmit () {
    const { path } = this.props
    const { add: { address, permissions } } = this.state
    let errors = []

    // CHECK ADDRESS
    if (address.length !== 42) errors.push('Address is not a valid ethereum address')
    if (permissions === 0) errors.push('You can\'t give someone no permissions')

    if (errors.length > 0) {
      this.setState({
        ...this.state,
        add: { ...this.state.add, errors }
      })
    } else {
      // Give read
      if (permissions % 2 === 1) this.props.handleGiveRead(address, path)

      // Give write
      if (permissions % 4 >= 2) this.props.handleGiveWrite(address, path)
    }
  }

  render () {
    const { identity, path } = this.props
    const { add: { address, permissions, type, errors } } = this.state

    return (
      <div className='container-fluid' >
        <div className={ styles.main } >
          <h2 className={ styles.title } >
            { path }
          </h2>
          <hr />
          <h4 className={ styles.titleUpdate } >
            Invite
          </h4>
          <div className='row' >
            {/* ADD PARTY */}
            <div className='col-xs-12' >
              <input
                className={ styles.addressInput }
                placeholder='Enter address'
                value={ address }
                onChange={ (e) => this.handleAddressUpdate(e) }
              />
            </div>
            <div className='col-xs-6' >
              <div className={ styles.type } >
                <button
                  className={ type === 0 ?
                    styles.buttonIndividualGroupSelected :
                    styles.buttonIndividualGroup }
                  onClick={ () => this.handleChangeType(0) } >
                  Person
                </button>
                <button
                  className={ type === 1 ?
                    styles.buttonIndividualGroupSelected :
                    styles.buttonIndividualGroup }
                  onClick={ () => this.handleChangeType(1) } >
                  Group
                </button>
              </div>
            </div>
            <div className='col-xs-6' >
              <div className={ styles.permissions } >
                <button
                  className={ permissions % 2 === 1 ?
                    styles.buttonIndividualGroupSelected :
                    styles.buttonIndividualGroup }
                  onClick={ () => this.handleToggleRead() } >
                  Read
                </button>
                <button
                  className={ permissions % 4 >= 2 ?
                    styles.buttonIndividualGroupSelected :
                    styles.buttonIndividualGroup }
                  onClick={ () => this.handleToggleWrite() } >
                  Write
                </button>
              </div>
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
          <hr />

          {/* LIST CURRENT */}
          <PermissionsList path={ `${identity}/${path}` } />
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ShareAdminPage)
