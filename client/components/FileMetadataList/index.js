import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  fileSubmit
} from '../../actions'

const mapStateToProps = (state) => {
  const fileSize = state.files.length
  return {
    files: state.files,
    fileSize
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFileSubmit: (i) => dispatch(fileSubmit(i))
  }
}

class FileMetadataList extends Component {

  static displayName = 'File Metadata List'
  static propTypes = {
    files: PropTypes.any,
    fileSize: PropTypes.arrayOf(PropTypes.number).isRequired
  }

  renderFiles () {
    const { files, fileSize } = this.props
    return Array(fileSize).fill().map((_, i) => {
      console.dir(files[i])
      return (
        <div key={i}>
          { files[i].name }
          <img src={ files[i].preview } />
        </div>
      )
    })
  }

  render () {
    const {
      files,
      fileSize
    } = this.props
    return (
      <div className="filemetadatalist-container" >
        { fileSize !== undefined &&
          files !== undefined &&
          files.length > 0 &&
          this.renderFiles() }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FileMetadataList)
