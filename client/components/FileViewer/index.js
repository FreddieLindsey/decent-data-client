import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import {
  // filesLoad
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  const contractSize = state.IPFSStorage.size
  const fileSize = state.files.stored.length
  return {
    files: state.files.stored,
    fileSize,
    contractSize,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // handleFilesSubmit: () => dispatch(filesSubmit())
  }
}

class FileViewer extends Component {

  static displayName = 'File Viewer'
  static propTypes = {
    contractSize: PropTypes.number.isRequired,
    files: PropTypes.any,
    fileSize: PropTypes.number.isRequired,
    // handleFilesSubmit: PropTypes.func.isRequired
  }

  getColumns() {
    return [
      {
        header: 'Filename',
        accessor: 'path'
      },
      {
        header: 'Hash',
        accessor: 'hash'
      },
      {
        header: 'Size',
        accessor: 'size'
      },
      {
        id: 'preview',
        header: 'Preview',
        accessor: f => (f.hash && !f.retrieving) ?
          'true' : 
          f.hash
      }
    ]
  }

  getFiles() {

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
            data={files}
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
