import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FilePreview from '../FilePreview'

import {
  ipfsStorageGet
} from '../../actions'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => {
  const owned = ownProps.match.path.indexOf('/personal') !== -1
  const path = ownProps.match.params.path
  const address = owned ? state.security.address : ownProps.address
  return {
    address,
    owned,
    retrieved: !!state.files.stored[`${address}/${path}`].content,
    path
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleGetContent: (p) => dispatch(ipfsStorageGet(p))
})

class ViewBlobPage extends Component {

  static displayName = 'View Blob Page'
  static propTypes = {
    address: PropTypes.string.isRequired,
    owned: PropTypes.bool.isRequired,
    retrieved: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,

    handleGetContent: PropTypes.func.isRequired
  }

  componentWillMount () {
    if (!this.props.retrieved)
      this.props.handleGetContent(this.props.path)
  }

  render () {
    const { address, path, owned } = this.props

    return (
      <div className={ styles.main } >
        <h2 className={ styles.header } >
          { owned ? 'Personal' : 'Shared' } / { path }
        </h2>
        <hr />
        <FilePreview path={ `${address}/${path}` } />
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBlobPage)
