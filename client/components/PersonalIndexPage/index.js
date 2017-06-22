import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import PathIndex from '../PathIndex'

import styles from './index.scss'

import {
  ipfsStorageSizeGet,
  ipfsStorageIndexGet,
  loadEncryptionKeys,
} from '../../actions'

const mapStateToProps = (state) => {
  const { address } = state.security
  const { identities } = state.IPFSStorage
  return {
    secretKey: !!state.security.encryption.secretKey,
    IPFSStorage: identities[address],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSizeGet: () => dispatch(ipfsStorageSizeGet()),
    handleIndexGet: (i) => dispatch(ipfsStorageIndexGet(i)),
    handleLoadEncryptionKeys: (f) => dispatch(loadEncryptionKeys(f))
  }
}

class PersonalIndex extends Component {

  static displayName = 'Personal Index'
  static propTypes = {
    secretKey: PropTypes.bool.isRequired,
    IPFSStorage: PropTypes.shape({
      address: PropTypes.string.isRequired,
      size: PropTypes.number
    }),

    handleSizeGet: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
    handleLoadEncryptionKeys: PropTypes.func.isRequired
  }

  componentWillMount () {
    // this.getCheck()
  }

  componentWillReceiveProps (nextProps) {
    // this.getCheck(nextProps)
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
          className={ styles.secretKey }
          onDrop={ (f) => this.props.handleLoadEncryptionKeys(f) } >
          <p className={ styles.secretKeyText } >
            Encryption Key
          </p>
        </Dropzone>
      </div>
    </div>
  )

  render () {
    const {
      secretKey
    } = this.props

    return secretKey ?
      this.renderIndex() :
      this.renderNeedKey()
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalIndex)
