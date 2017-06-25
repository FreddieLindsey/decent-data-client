import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

import FilePreview from '../FilePreview'

import {
  ipfsStorageGet,
  ipfsStorageAdd,
  ipfsStorageGetPublicKey,
  fileRetrieve
} from '../../actions'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => {
  const owned = ownProps.match.path.indexOf('/personal') !== -1
  const queries = ownProps.location.search.slice(1).split('&')
  const path = queries[queries.length - 1].slice(5)
  const address = owned ? state.security.address : queries[0].slice(8)
  const keys = state.Registry.identities
  return {
    address,
    owned,
    keys,
    retrieved: !!state.files.stored[`${address}/${path}`].content,
    path
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleGetContent: (p) => dispatch(ipfsStorageGet(p)),
  handleGetContentShared: (a, p) => dispatch(ipfsStorageGet(p, a)),
  handleAdd: (f, a, p) => dispatch(ipfsStorageAdd(f, a, p)),
  handleGetPublicKey: (a) => dispatch(ipfsStorageGetPublicKey(a))
})

class ViewBlobPage extends Component {

  static displayName = 'View Blob Page'
  static propTypes = {
    address: PropTypes.string.isRequired,
    owned: PropTypes.bool.isRequired,
    retrieved: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,

    handleGetContent: PropTypes.func.isRequired,
    handleGetContentShared: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleGetPublicKey: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { owned, address, retrieved, path } = this.props
    this.props.handleGetPublicKey(address)
    if (!retrieved)
      owned ?
        this.props.handleGetContent(path) :
        this.props.handleGetContentShared(address, path)
  }

  render () {
    const { address, path, owned } = this.props

    return (
      <div className={ styles.main } >
        <h2 className={ styles.header } >
          { owned ?
            'Personal' :
            `Shared / ${address.slice(0, 5)}...${address.slice(address.length - 3)}`
          } / { path }
        </h2>
        <hr />
        <FilePreview path={ `${address}/${path}` } />
        <Dropzone
          className={ styles.dropzone }
          onDrop={(f) => this.props.handleAdd(f[0], address, path) } >
          <div className={ styles.dropzoneText }>
            Upload new version
          </div>
        </Dropzone>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBlobPage)
