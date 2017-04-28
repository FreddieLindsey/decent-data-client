import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  loadPrivateKey,
  loadPublicKey
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  return {
    ...state.security
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadPrivateKey: (f) => dispatch(loadPrivateKey(f)),
    handleLoadPublicKey: (f) => dispatch(loadPublicKey(f))
  }
}

class SecureKeyLoader extends Component {

  static displayName = 'Secure Key Loader'
  static propTypes = {
    privateKey: PropTypes.object,
    publicKey: PropTypes.object,
    error: PropTypes.object,
    handleLoadPrivateKey: PropTypes.func.isRequired,
    handleLoadPublicKey: PropTypes.func.isRequired
  }

  render() {
    return (
      <div
        className='securekeyloader-container'
        style={{
          display: !(this.props.privateKey && this.props.publicKey) ? 'inherit' : 'none'
        }} >
        <h2>Secure Key Loader</h2>
        <strong>Please only drop private / public key files.</strong>

        {
          !this.props.privateKey &&
          <Dropzone className="dropzone" onDrop={(f) => this.props.handleLoadPrivateKey(f) } >
            Please drop your private key here
          </Dropzone>
        }
        {
          !this.props.publicKey &&
          <Dropzone className="dropzone" onDrop={(f) => this.props.handleLoadPublicKey(f) } >
            Please drop your public key here
          </Dropzone>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SecureKeyLoader)
