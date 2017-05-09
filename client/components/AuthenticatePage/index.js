import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropdown from 'react-dropdown'
import Dropzone from 'react-dropzone'

import { Redirect } from 'react-router'

import styles from './index.scss'

import {
  loadECDSAPrivateKey,
  registryAddStore,
  registryGetStore,
  ipfsStorageCreate
} from '../../actions'

const mapStateToProps = (state) => {
  const {
    security: { address, error },
    IPFSStorage,
    Registry
  } = state
  return {
    authenticated: !!address && !!Registry.store.retrieved ,
    address: !!address,
    ipfsStorage: IPFSStorage,
    registry: Registry,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadPrivateKey: (key) => dispatch(loadECDSAPrivateKey(key)),
    handleAddStore: () => dispatch(registryAddStore()),
    handleGetStore: () => dispatch(registryGetStore()),
    handleIpfsStorageCreate: () => dispatch(ipfsStorageCreate())
  }
}

class Authenticate extends Component {

  static displayName = 'Authenticate'
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    address: PropTypes.bool.isRequired,
    ipfsStorage: PropTypes.shape({}).isRequired,
    registry: PropTypes.shape({}).isRequired,
    error: PropTypes.object,

    handleLoadPrivateKey: PropTypes.func.isRequired,
    handleAddStore: PropTypes.func.isRequired,
    handleGetStore: PropTypes.func.isRequired,
    handleIpfsStorageCreate: PropTypes.func.isRequired,
  }

  componentWillReceiveProps (nextProps) {
    const {
      address,
      ipfsStorage,
      registry
    } = nextProps

    if (address && !registry.store.triedGet)
      nextProps.handleGetStore()

    if (address && registry.store.triedGet && !ipfsStorage.address && !registry.store.retrieved)
      nextProps.handleIpfsStorageCreate()

    if (address && registry.store.triedGet && ipfsStorage.address && !registry.store.retrieved)
      nextProps.handleAddStore()

    if (address && registry.store.triedGet && registry.store.triedAdd && !registry.store.retrieved)
      nextProps.handleGetStore()
  }

  renderUnauthenticated = () => {
    const {
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
                  className={ styles.privateKey }
                  onDrop={ (f) => this.props.handleLoadPrivateKey(f) } >
                  <p className={ styles.privateKeyText } >
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
        </div>
      </div>
    )
  }

  renderAuthenticated = () =>
    <Redirect to={{
      pathname: '/app/personal',
      state: { from: '/authenticate' }
    }}/>

  render () {
    return this.props.authenticated ?
      this.renderAuthenticated() :
      this.renderUnauthenticated()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
