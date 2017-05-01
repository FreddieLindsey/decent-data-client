import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

import FileDropper from '../FileDropper'
import FileMetadataList from '../FileMetadataList'

class UploadPage extends Component {

  static displayName = 'Upload Page'

  render () {
    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          <FileDropper />
          <FileMetadataList />
        </div>
      </div>
    )
  }

}

export default UploadPage
