import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  fileRetrieve
} from '../../actions'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => {
  const { path } = ownProps.match.params
  const file = state.files.stored[path]
  return {
    path,
    file
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFileRetrieve: (path) => dispatch(fileRetrieve(path))
  }
}

class FileViewer extends Component {

  static displayName = 'File Viewer'
  static propTypes = {
    path: PropTypes.string.isRequired,
    file: PropTypes.shape({
      retrieved: PropTypes.bool.isRequired,
      retrieving: PropTypes.bool.isRequired,
      content: PropTypes.string
    }),

    handleFileRetrieve: PropTypes.func.isRequired
  }

  componentWillMount() {
    const {
      path,
      file: { retrieved, retrieving, content }
    } = this.props

    if (!content && !retrieving && !retrieved)
      this.props.handleFileRetrieve(path)
  }

  render () {
    const {
      path,
      file: {
        content
      }
    } = this.props

    return (
      <div className={ styles.container } >
        <h2>File Viewer</h2>
        { content && content }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FileViewer)
