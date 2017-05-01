import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import {
  filesLoad
} from '../../actions'

import styles from './index.scss'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFilesLoad: (f) => dispatch(filesLoad(f))
  }
}

class FileDropper extends Component {

  static displayName = 'File Dropper'
  static propTypes = {
    handleFilesLoad: PropTypes.func.isRequired
  }

  render = () =>
    <Dropzone
      className={ styles.dropzone }
      onDrop={(f) => this.props.handleFilesLoad(f) } >
      <div className={ styles.dropzoneText }>
        Upload files
      </div>
    </Dropzone>

}

export default connect(mapStateToProps, mapDispatchToProps)(FileDropper)
