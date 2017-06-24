import React, { Component, PropTypes } from 'react'

import Dropzone from 'react-dropzone'

import styles from './FileDropper.scss'

export default class FileDropper extends Component {

  static displayName = 'File Dropper'
  static propTypes = {
    text: PropTypes.string.isRequired,
    classNames: PropTypes.shape({
      main: PropTypes.string.isRequired,
      inner: PropTypes.string.isRequired
    }),

    handleDrop: PropTypes.func.isRequired
  }
  static defaultProps = {
    text: 'Upload files',
    classNames: {
      main: styles.dropzone,
      inner: styles.dropzoneText
    }
  }

  render = () =>
    <Dropzone
      className={ this.props.classNames.main }
      onDrop={ (f) => this.props.handleDrop(f) } >
      <div className={ this.props.classNames.inner }>
        { this.props.text }
      </div>
    </Dropzone>

}
