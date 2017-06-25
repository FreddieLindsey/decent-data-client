import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import CreateStorageContract from '../components/CreateStorageContract'
import EncryptionKeyRequired from '../components/EncryptionKeyRequired'
import PathIndex from '../components/PathIndex'

import styles from './Personal.scss'

import {
  registryGetStore,
  ipfsStorageSizeGet,
  ipfsStorageIndexGet
} from '../actions'

const mapStateToProps = (state) => {
  const { address } = state.security
  return {
    address,
    Registry: {
      ...state.Registry[address]
    },
    secretKey: !!state.security.encryption.secretKey,
    IPFSStorage: state.IPFSStorage.identities[address],
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
    address: PropTypes.string,
    Registry: PropTypes.shape({
      address: PropTypes.string,
      error: PropTypes.any
    }),
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

  componentWillMount () {
    this.getCheck(this.props)
  }

  componentWillReceiveProps (props) {
    this.getCheck(props)
  }

  getCheck (props) {
    const { address, Registry, IPFSStorage, size } = props
    if (address && Registry && !Registry.error)
      if (!IPFSStorage)
        this.props.handleGetStore(address)
      else if (IPFSStorage.size === -1)
        props.handleSizeGet()
      else if (IPFSStorage.size !== -1 &&
               Object.keys(IPFSStorage.files).length !== IPFSStorage.size)
        for (let i = 0; i < IPFSStorage.size; i++)
          props.handleIndexGet(i)
  }

  renderIndex = () => <PathIndex address={ this.props.address } />

  renderNeedKey = () => <EncryptionKeyRequired />

  renderNeedStorage = () => {
    const { Registry } = this.props
    return (
      <div className={ styles.container } >
        { Registry && !Registry.error ?
          <div className={ styles.noStorage } >
            Retrieving contract...
          </div> :
          <div className={ styles.noStorage } >
            A storage contract could not be retrieved.
            <CreateStorageContract />
          </div>
        }

      </div>
    )
  }

  render () {
    const {
      Registry,
      secretKey
    } = this.props

    return Registry && Registry.address ?
      secretKey ?
      this.renderIndex() :
      this.renderNeedKey() :
      this.renderNeedStorage()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)
