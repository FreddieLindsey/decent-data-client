import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import {
  filesSubmit
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  const fileSize = state.files.length
  return {
    files: state.files,
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

  getColumns() {
    return [
      {
        header: 'Filename',
        accessor: 'name'
      },
      {
        id: 'preview',
        header: 'Preview',
        accessor: f => {
          if (f.type.indexOf('image') !== -1) {
            return (<img
              className='filemetadatalist-preview'
              src={ f.content }
            />)
          } else {
            return (<embed
              className='filemetadatalist-preview'
              src={ f.content }
            />)
          }
        }
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
      <div className="filemetadatalist-container" >
        <h2>File Metadata List</h2>
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
        { fileSize > 0 &&
          <button
            className='col-md-12 filemetadatalist-submit'
            onClick={ () => this.props.handleFilesSubmit() } >
            Send to IPFS
          </button>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FileMetadataList)
