import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  filesLoad
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFilesLoad: (f) => filesLoad(dispatch, f)
  }
}

class IPFSFileDropper extends Component {

  static displayName = 'IPFS File Dropper'
  static propTypes = {
    handleFilesLoad: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <h2>IPFS File Dropper</h2>
        <strong>Please only drop files. Folders will not be processed correctly.</strong>

        <Dropzone className="dropzone" onDrop={(f) => this.props.handleFilesLoad(f) } >
          Please drop files here
        </Dropzone>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(IPFSFileDropper)
