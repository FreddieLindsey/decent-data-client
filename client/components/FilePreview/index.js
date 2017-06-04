import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

const formDataUri = (path, content) => {
  let dataUri = 'data:'
  const type = path.slice(path.indexOf('.') + 1).toLowerCase()
  if (type === 'txt' || type === 'md')
    dataUri += 'text/plain'
  else if (type === 'jpg' || type === 'jpeg')
    dataUri += 'image/jpeg'
  else if (type === 'png')
    dataUri += 'image/png'
  else if (type === 'gif')
    dataUri += 'image/gif'
  else
    dataUri += 'application/other'

  dataUri += ';base64,' + content
  return dataUri
}

const mapStateToProps = (state, props) => {
  const index = props.loaded ? state.files.loaded : state.files.stored
  const path = props.path
  const { content } = index[props.path]
  return {
    path,
    content: formDataUri(path, content)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

class FilePreview extends Component {

  static displayName = 'File Preview'
  static propTypes = {
    path: PropTypes.string.isRequired,
    content: PropTypes.string
  }

  handleDecode () {
    const { content } = this.props
    return content ?
      window.atob(content) :
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
    const { path, content } = this.props
    if (!content) return this.renderNoContent()

    const type = path.slice(path.indexOf('.') + 1).toLowerCase()
    switch (type) {
      case 'txt':
      case 'md':
        return this.renderText()
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return this.renderImage()
      default:
        return this.renderUnknown()
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreview)
