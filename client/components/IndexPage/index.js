import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

import {
  ipfsStorageSizeGet,
  ipfsStorageIndexGet,
} from '../../actions'

const mapStateToProps = (state) => {
  return {
    files: state.files.stored,
    IPFSStorage: state.IPFSStorage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSizeGet: () => dispatch(ipfsStorageSizeGet()),
    handleIndexGet: (i) => dispatch(ipfsStorageIndexGet(i)),
  }
}

class Index extends Component {

  static displayName = 'Index'
  static propTypes = {
    files: PropTypes.object.isRequired,
    IPFSStorage: PropTypes.shape({
      address: PropTypes.string,
      size: PropTypes.number
    }).isRequired,

    handleSizeGet: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
  }

  componentDidMount () {
    this.props.handleSizeGet()
    this.getData()
  }

  getData () {
    const {
      IPFSStorage: {
        size
      },
      files
    } = this.props

    if (size && size != 0 && Object.keys(files).length == 0)
      for (let i = 0; i < size; i++)
        this.props.handleIndexGet(i)
  }

  render () {
    const {
      IPFSStorage: {
        size
      }
    } = this.props

    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          Size of contract: { size }
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
