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
  const identity = owned ? state.security.address : queries[0].slice(8)
  const file_ = state.files.stored[`${identity}/${path}`]
  const keys = state.Registry.identities
  return {
    address: state.security.address,
    identity,
    owned,
    keys,
    retrieved: file_ && !!file_.content,
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
    address: PropTypes.string,
    identity: PropTypes.string.isRequired,
    owned: PropTypes.bool.isRequired,
    retrieved: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,

    handleGetContent: PropTypes.func.isRequired,
    handleGetContentShared: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleGetPublicKey: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { address, owned, identity, retrieved, path } = this.props
    if (!address) return

    this.props.handleGetPublicKey(identity)
    if (!retrieved)
      owned ?
        this.props.handleGetContent(path) :
        this.props.handleGetContentShared(identity, path)
  }

  render () {
    const { identity, path, owned } = this.props

    return (
      <div className={ styles.main } >
        <h2 className={ styles.header } >
          { owned ?
            'Personal' :
            `Shared / ${identity.slice(0, 5)}...${identity.slice(identity.length - 3)}`
          } / { path }
        </h2>
        <hr />
        <FilePreview path={ `${identity}/${path}` } />
        <Dropzone
          className={ styles.dropzone }
          onDrop={(f) => this.props.handleAdd(f[0], identity, path) } >
          <div className={ styles.dropzoneText }>
            Upload new version
          </div>
        </Dropzone>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBlobPage)
