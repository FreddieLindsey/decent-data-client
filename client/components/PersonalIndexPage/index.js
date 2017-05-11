import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import PathIndex from '../PathIndex'

import styles from './index.scss'

import {
  ipfsStorageSizeGet,
  ipfsStorageIndexGet,
  loadRSAPrivateKey,
} from '../../actions'

const mapStateToProps = (state) => {
  const { address } = state.security
  const { identities } = state.IPFSStorage
  return {
    rsaKey: !!state.security.rsa.privateKey,
    IPFSStorage: identities[address],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSizeGet: () => dispatch(ipfsStorageSizeGet()),
    handleIndexGet: (i) => dispatch(ipfsStorageIndexGet(i)),
    handleLoadRSAPrivateKey: (f) => dispatch(loadRSAPrivateKey(f))
  }
}

class Index extends Component {

  static displayName = 'Index'
  static propTypes = {
    rsaKey: PropTypes.bool.isRequired,
    IPFSStorage: PropTypes.shape({
      address: PropTypes.string.isRequired,
      size: PropTypes.number
    }).isRequired,

    handleSizeGet: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
    handleLoadRSAPrivateKey: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.getCheck()
  }

  componentWillReceiveProps (nextProps) {
    this.getCheck(nextProps)
  }

  getCheck (props) {
    let props_ = props || this.props
    const { IPFSStorage: { files, size } } = props_

    if (typeof size === 'undefined')
      props_.handleSizeGet()
    else if (size != 0 && Object.keys(files).length == 0)
      for (let i = 0; i < size; i++)
        props_.handleIndexGet(i)
  }

  renderIndex = () => (
    <div className={ styles.container } >
      <div className={ styles.main } >
        <PathIndex />
      </div>
    </div>
  )

  renderNeedKey = () => (
    <div className={ styles.container } >
      <div className={ styles.noKey } >
        <h3 className={ styles.noKeyTitle } >
          You need to provide your encryption key before you can view data.
          Supplying the wrong key will result in unreadable data.
        </h3>
        <hr />
        <Dropzone
          className={ styles.privateKey }
          onDrop={ (f) => this.props.handleLoadRSAPrivateKey(f) } >
          <p className={ styles.privateKeyText } >
            Encryption Key
          </p>
        </Dropzone>
      </div>
    </div>
  )

  render () {
    this.getCheck()

    const {
      rsaKey
    } = this.props

    return rsaKey ?
      this.renderIndex() :
      this.renderNeedKey()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
