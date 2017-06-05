import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'
import Dropzone from 'react-dropzone'

import { Redirect } from 'react-router'

import styles from './index.scss'

import {
  loadECDSAPrivateKey,
  loadEncryptionKeys,
  registryAddStore,
  registryGetStore,
  ipfsStorageCreate
} from '../../actions'

const mapStateToProps = (state) => {
  const {
    security: { address, encryption, error },
    IPFSStorage,
    Registry
  } = state
  return {
    authenticated: !!address && !!Registry.store.retrieved ,
    address,
    ipfsStorage: IPFSStorage,
    registry: Registry,
    isError: !!error || !!IPFSStorage.error,
    encryptionKey: !!encryption.secretKey,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadECDSAPrivateKey: (key) => dispatch(loadECDSAPrivateKey(key)),
    handleLoadEncryptionKeys: (keys) => dispatch(loadEncryptionKeys(keys)),
    handleAddStore: () => dispatch(registryAddStore()),
    handleGetStore: () => dispatch(registryGetStore()),
    handleIpfsStorageCreate: () => dispatch(ipfsStorageCreate())
  }
}

class Authenticate extends Component {

  static displayName = 'Authenticate'
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    address: PropTypes.string,
    ipfsStorage: PropTypes.shape({}).isRequired,
    registry: PropTypes.shape({}).isRequired,
    isError: PropTypes.bool.isRequired,
    encryptionKey: PropTypes.bool.isRequired,
    error: PropTypes.object,

    handleLoadECDSAPrivateKey: PropTypes.func.isRequired,
    handleLoadEncryptionKeys: PropTypes.func.isRequired,
    handleAddStore: PropTypes.func.isRequired,
    handleGetStore: PropTypes.func.isRequired,
    handleIpfsStorageCreate: PropTypes.func.isRequired,
  }

  componentWillReceiveProps (nextProps) {
    const {
      address,
      ipfsStorage,
      registry,
      encryptionKey,
      isError
    } = nextProps

    if (isError) return

    if (address &&
        !registry.store.triedGet)
      nextProps.handleGetStore()

    if (!encryptionKey) return

    if (address &&
        encryptionKey &&
        registry.store.triedGet &&
        !ipfsStorage.mine &&
        !registry.store.retrieved)
      nextProps.handleIpfsStorageCreate()

    if (address &&
        encryptionKey &&
        registry.store.triedGet &&
        ipfsStorage.mine &&
        !registry.store.retrieved)
      nextProps.handleAddStore()

    if (address &&
        encryptionKey &&
        registry.store.triedGet &&
        registry.store.triedAdd &&
        !registry.store.retrieved &&
        !registry.store.error)
      nextProps.handleGetStore()
  }

  renderUnauthenticated = () => {
    const {
      encryptionKey,
      registry: { store },
      error
    } = this.props

    return (
      <div className={ styles.container } >
        <div className={ styles.main } >
          <h2 className={ styles.title }>
            Please authenticate yourself by providing your private key
          </h2>
          <hr />
          <div className={ styles.keys } >
            <div className='row' >
              <div className={ 'col-xs-12' } >
                <Dropzone
                  className={ styles.secretKey }
                  onDrop={ (f) => this.props.handleLoadECDSAPrivateKey(f) } >
                  <p className={ styles.secretKeyText } >
                    Private Key
                  </p>
                </Dropzone>
              </div>
            </div>
            {
              error &&
              <p className={ styles.keyError } >
                { error.toString() }
              </p>
            }
          </div>
          {
            store.triedGet && !store.retrieved && !encryptionKey &&
            <div>
              <hr />
              <div className={ styles.keys } >
                <div className='row' >
                  <div className={ 'col-xs-12' } >
                    You don't appear to have previously registered.
                    Please provide an encryption key to register.
                  </div>
                  <div className={ 'col-xs-12' } >
                    <Dropzone
                      className={ styles.secretKey }
                      onDrop={ (f) => this.props.handleLoadEncryptionKeys(f) } >
                      <p className={ styles.secretKeyText } >
                        Encryption Key
                      </p>
                    </Dropzone>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  renderAuthenticated = () =>
    <Redirect to={{
      pathname: '/personal',
      state: { from: '/authenticate' }
    }}/>

  render () {
    return this.props.authenticated ?
      this.renderAuthenticated() :
      this.renderUnauthenticated()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
