import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import FilePreview from '../FilePreview'

import {
  // filesLoad
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  const contractSize = state.IPFSStorage.size || 0
  const fileSize = Object.keys(state.files.stored).length
  return {
    files: state.files.stored,
    fileSize,
    contractSize,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

class FileViewer extends Component {

  static displayName = 'File Viewer'
  static propTypes = {
    contractSize: PropTypes.number.isRequired,
    files: PropTypes.any,
    fileSize: PropTypes.number.isRequired
  }

  getFiles() {
    const {
      files
    } = this.props

    let fileArray = []
    for (const f in files) {
      fileArray.push({ ...files[f], path: f })
    }

    fileArray.sort()
    return fileArray
  }

  getColumns() {
    return [
      {
        header: 'Path',
        accessor: 'path'
      },
      {
        id: 'preview',
        header: 'Preview',
        accessor: f => <FilePreview path={ f.path } />
      }
    ]
  }

  render () {
    const {
      contractSize,
      files,
      fileSize
    } = this.props

    if (contractSize > fileSize) this.getFiles()

    const reactTableProps = {
      pageSize: fileSize,
      resizable: false,
      showPagination: false
    }

    return (
      <div className="fileviewer-container" >
        <h2>File Viewer</h2>
        { fileSize > 0 ?
          <ReactTable
            data={ this.getFiles() }
            columns={ this.getColumns() }
            { ...reactTableProps }
          /> :
          <div style={{ textAlign: 'center', width: '100%' }} >
            No files loaded
          </div>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FileViewer)
