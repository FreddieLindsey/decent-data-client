import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

const mapStateToProps = (state, props) => {
  const index = props.loaded ? state.files.loaded : state.files.stored
  return {
    ...index[props.path]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

class FilePreview extends Component {

  static displayName = 'File Preview'
  static propTypes = {
    content: PropTypes.string,
    type: PropTypes.string
  }

  render () {
    return <embed className={ styles.preview } src={ this.props.content } />
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreview)
