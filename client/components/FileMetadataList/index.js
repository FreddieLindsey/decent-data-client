import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import FilePreview from '../FilePreview'

import styles from './index.scss'

import {
  filesSubmit
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  const fileSize = Object.keys(state.files.loaded).length
  return {
    files: state.files.loaded,
    fileSize
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFilesSubmit: () => dispatch(filesSubmit())
  }
}

class FileMetadataList extends Component {

  static displayName = 'File Metadata List'
  static propTypes = {
    files: PropTypes.any,
    fileSize: PropTypes.number.isRequired,
    handleFilesSubmit: PropTypes.func.isRequired
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
        accessor: f => <FilePreview loaded path={ f.path } />
      }
    ]
  }

  render () {
    const {
      fileSize
    } = this.props

    const reactTableProps = {
      pageSize: fileSize,
      resizable: false,
      showPagination: false
    }

    return (
      <div className={ styles.container } >
        { fileSize > 0 ?
          <ReactTable
            data={ this.getFiles() }
            columns={ this.getColumns() }
            { ...reactTableProps }
          /> :
          <div className={ styles.noFiles } >
            No files loaded
          </div>
        }
        { fileSize > 0 &&
          <button
            className={'col-md-12 ' + styles.submit }
            onClick={ () => this.props.handleFilesSubmit() } >
            Send to IPFS
          </button>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FileMetadataList)
