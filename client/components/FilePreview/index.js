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
    content: PropTypes.string
  }

  handleDecode () {
    const { content } = this.props
    return content ?
      window.atob(content.slice(content.indexOf('base64,') + 7)) :
      ''
  }

  renderNoContent () {
    return (
      <div className={ styles.noContent } >
        No content
      </div>
    )
  }

  renderText () {
    return (
      <pre className={ styles.viewText }>
        { this.handleDecode() }
      </pre>
    )
  }

  renderImage () {
    const { content } = this.props
    return (
      <div className={ styles.viewImageContainer } >
        <img className={ styles.viewImage } src={ content } />
      </div>
    )
  }

  renderUnknown () {
    const { content } = this.props
    return <embed className={ styles.preview } src={ content } />
  }

  render () {
    const { content } = this.props
    if (!content) return this.renderNoContent()

    const type = content.slice(5, content.indexOf(';'))
    switch (type) {
      case 'text/plain':
        return this.renderText()
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return this.renderImage()
      default:
        return this.renderUnknown()
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreview)
