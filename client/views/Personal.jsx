import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import PathIndex from '../components/PathIndex'

import styles from './Personal.scss'

import {
  registryGetStore,
  ipfsStorageSizeGet,
  ipfsStorageIndexGet,
  loadEncryptionKeys,
} from '../actions'

const mapStateToProps = (state) => {
  const { address } = state.security
  const { identities } = state.IPFSStorage
  return {
    address: address,
    secretKey: !!state.security.encryption.secretKey,
    IPFSStorage: identities[address],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetStore: (a) => dispatch(registryGetStore(a)),
    handleSizeGet: () => dispatch(ipfsStorageSizeGet()),
    handleIndexGet: (i) => dispatch(ipfsStorageIndexGet(i)),
    handleLoadEncryptionKeys: (f) => dispatch(loadEncryptionKeys(f))
  }
}

class Personal extends Component {

  static displayName = 'Personal Index'
  static propTypes = {
    secretKey: PropTypes.bool.isRequired,
    IPFSStorage: PropTypes.shape({
      address: PropTypes.string.isRequired,
      size: PropTypes.number
    }),

    handleGetStore: PropTypes.func.isRequired,
    handleSizeGet: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
    handleLoadEncryptionKeys: PropTypes.func.isRequired
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
          className={ styles.secretKey }
          onDrop={ (f) => this.props.handleLoadEncryptionKeys(f) } >
          <p className={ styles.secretKeyText } >
            Encryption Key
          </p>
        </Dropzone>
      </div>
    </div>
  )

  renderNeedStorage = () => {
    return (
      <div className={ styles.container } >
        <div className={ styles.noStorage } >
          Unable to retrieve your storage contract. Will retry another 5 times.
        </div>
      </div>
    )
  }

  render () {
    const {
      IPFSStorage,
      secretKey
    } = this.props

    return IPFSStorage ?
      secretKey ?
      this.renderIndex() :
      this.renderNeedKey() :
      this.renderNeedStorage()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)
