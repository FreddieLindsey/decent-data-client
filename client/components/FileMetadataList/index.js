import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import PathEditor from '../PathEditor'
import FilePreview from '../FilePreview'

import styles from './index.scss'

import {
  filesSubmit
} from '../../actions'

import './index.scss'

const mapStateToProps = (state) => {
  return {
    files: {
      ...state.files.loaded
    }
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

  renderHeader = () => (
    <div className='row' >
      <div className='col-xs-4' >
        <div className={ styles.header } >
          Path
        </div>
      </div>
      <div className='col-xs-8' >
        <div className={ styles.header } >
          Preview
        </div>
      </div>
    </div>
  )

  render () {
    const files = this.getFiles()
    const Row = ({ path }) => {
      return (
        <div>
          <div className='row' key={ path } >
            <div className='col-xs-4' >
              <PathEditor path={ path } />
            </div>
            <div className='col-xs-8' >
              <FilePreview loaded path={ path } />
            </div>
          </div>
          <hr />
        </div>
      )
    }

    return (
      <div className={ styles.container } >
        { files.length > 0 ?
          <div className={ styles.table }>
            <hr />
            { this.renderHeader() }
            <hr />
            {
              files.map((f) => Row(f))
            }
          </div> :
          <div className={ styles.noFiles } >
            No files loaded
          </div>
        }
        { files.length > 0 &&
          <button
            className={ 'col-xs-12 ' + styles.submit }
            onClick={ () => this.props.handleFilesSubmit() } >
            Send to IPFS
          </button>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FileMetadataList)
