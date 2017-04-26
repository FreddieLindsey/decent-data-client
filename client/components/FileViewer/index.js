import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import {
  // filesLoad
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  const fileSize = state.files.stored.length
  return {
    files: state.files.stored,
    fileSize
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
      }
    ]
  }

  render () {
    const {
      files,
      fileSize
    } = this.props

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
