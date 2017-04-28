import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  loadSecureKey
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  return {
    ...state.security
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadSecureKey: (f) => dispatch(loadSecureKey(f))
  }
}

class SecureKeyLoader extends Component {

  static displayName = 'Secure Key Loader'
  static propTypes = {
    securekey: PropTypes.string,
    error: PropTypes.object,
    handleLoadSecureKey: PropTypes.func.isRequired
  }

  render() {
    return (
      <div
        className='securekeyloader-container'
        style={{ display: !this.props.securekey ? 'inherit' : 'none' }} >
        <h2>Secure Key Loader</h2>
        <strong>Please only drop private key files.</strong>

        <Dropzone className="dropzone" onDrop={(f) => this.props.handleLoadSecureKey(f) } >
          Please drop your private key here
        </Dropzone>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SecureKeyLoader)
