import React, { Component, PropTypes } from 'react'

import styles from './index.scss'

import FileDropper from '../FileDropper'
import FileMetadataList from '../FileMetadataList'

class UploadPage extends Component {

  static displayName = 'Upload Page'

  render () {
    return (
      <div className={ styles.container } >
        <FileDropper />
        <FileMetadataList />
      </div>
    )
  }

}

export default UploadPage
