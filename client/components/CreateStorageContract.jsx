import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  loadEncryptionKeys,
  ipfsStorageCreate,
  registryAddStore
} from '../actions'

import styles from './CreateStorageContract.scss'

const mapStateToProps = (state) => ({
  address: state.security.address,
  keys: { ...state.security.encryption },
  pending: state.IPFSStorage.pending,
  storage: state.Registry[state.security.address].address
})
const mapDispatchToProps = (dispatch) => ({
  handleCreateStore: (a) => dispatch(ipfsStorageCreate(a)),
  handleAddStore: (a) => dispatch(registryAddStore(a)),
  handleLoadEncryptionKeys: (f) => dispatch(loadEncryptionKeys(f))
})

class CreateStorageContract extends Component {

  static displayName = 'Create Storage Contract'
  static propTypes = {
    address: PropTypes.string.isRequired,
    keys: PropTypes.shape({
      secretKey: PropTypes.string,
      publicKey: PropTypes.string,
      error: PropTypes.any
    }).isRequired,
    pending: PropTypes.bool.isRequired,
    storage: PropTypes.string,

    handleCreateStore: PropTypes.func.isRequired,
    handleAddStore: PropTypes.func.isRequired,
    handleLoadEncryptionKeys: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.getCheck(this.props)
  }

  componentWillReceiveProps (props) {
    this.getCheck(props)
  }

  getCheck (props) {
    const { address, keys: { secretKey }, pending, storage } = props
    if (address && !storage && secretKey && !pending)
      this.props.handleCreateStore(address)
    if (address && storage && !pending)
      this.props.handleAddStore(address)
  }

  render () {
    const { keys: { error } } = this.props

    return (
      <div>
        Please create a storage contract by providing an encryption key.
        <hr />
        <Dropzone
          className={ styles.secretKey }
          onDrop={ (f) => this.props.handleLoadEncryptionKeys(f) } >
          <p className={ styles.secretKeyText } >
            Drop Key Here
          </p>
        </Dropzone>
        {
          error &&
          <p className={ styles.keyError } >
            { error.toString() }
          </p>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStorageContract)
