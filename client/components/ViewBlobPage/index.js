import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FilePreview from '../FilePreview'

import {
  ipfsStorageGet
} from '../../actions'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => {
  const owned = ownProps.match.path.indexOf('/personal') !== -1
  const queries = ownProps.location.search.slice(1).split('&')
  const path = queries[queries.length - 1].slice(5)
  const address = owned ? state.security.address : queries[0].slice(8)
  return {
    address,
    owned,
    retrieved: !!state.files.stored[`${address}/${path}`].content,
    path
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleGetContent: (p) => dispatch(ipfsStorageGet(p)),
  handleGetContentShared: (a, p) => dispatch(ipfsStorageGet(p, a))
})

class ViewBlobPage extends Component {

  static displayName = 'View Blob Page'
  static propTypes = {
    address: PropTypes.string.isRequired,
    owned: PropTypes.bool.isRequired,
    retrieved: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,

    handleGetContent: PropTypes.func.isRequired,
    handleGetContentShared: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { owned, address, retrieved, path } = this.props
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
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBlobPage)
