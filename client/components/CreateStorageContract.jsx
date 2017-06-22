import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  loadEncryptionKeys,
  registryAddStore
} from '../actions'

import styles from './CreateStorageContract.scss'

const mapStateToProps = (state) => ({
  keys: { ...state.security.encryption }
})
const mapDispatchToProps = (dispatch) => ({
  handleAddStore: () => dispatch(registryAddStore()),
  handleLoadEncryptionKeys: (f) => dispatch(loadEncryptionKeys(f))
})

class CreateStorageContract extends Component {

  static displayName = 'Create Storage Contract'
  static propTypes = {
    keys: PropTypes.shape({
      secretKey: PropTypes.string,
      publicKey: PropTypes.string,
      error: PropTypes.any
    }).isRequired,

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
    const { keys: { secretKey } } = props
    if (secretKey)
      this.props.handleAddStore()
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
