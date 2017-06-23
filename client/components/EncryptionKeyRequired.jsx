import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  loadEncryptionKeys
} from '../actions'

import styles from './EncryptionKeyRequired.scss'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  handleLoadEncryptionKeys: (f) => dispatch(loadEncryptionKeys(f))
})

class EncryptionKeyRequired extends Component {

  static displayName = 'Encryption Key Required'
  static propTypes = {
    handleLoadEncryptionKeys: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className={ styles.noKey } >
        <h5 className={ styles.noKeyTitle } >
          Please provide your encryption key to unlock your data.
        </h5>
        <hr />
        <Dropzone
          className={ styles.secretKey }
          onDrop={ (f) => this.props.handleLoadEncryptionKeys(f) } >
          <p className={ styles.secretKeyText } >
            Drop Key Here
          </p>
        </Dropzone>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(EncryptionKeyRequired)
