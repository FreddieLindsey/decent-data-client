import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'
import Select from 'react-select'

import PathIndex from '../PathIndex'

import styles from './index.scss'
import 'react-select/dist/react-select.css'

import {
  ipfsStorageSizeGet,
  ipfsStorageIndexGet,
  ipfsStorageSelect,
  loadRSAPrivateKey,
} from '../../actions'

const mapStateToProps = (state) => {
  let accounts = Object.keys(state.IPFSStorage.identities)
  accounts = accounts.filter((v) => v !== state.security.address).map(v => ({
    label: v,
    value: v
  }))
  const selected = state.IPFSStorage.selected
  return {
    rsaKey: !!state.security.rsa.privateKey,
    selected,
    accounts,
    data: state.IPFSStorage.identities[selected]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSizeGet: (a) => dispatch(ipfsStorageSizeGet(a)),
    handleIndexGet: (i, a) => dispatch(ipfsStorageIndexGet(i, a)),
    handleLoadRSAPrivateKey: (f) => dispatch(loadRSAPrivateKey(f)),
    handleIpfsStorageSelect: (v) => dispatch(ipfsStorageSelect(v))
  }
}

class SharedIndex extends Component {

  static displayName = 'Shared Index'
  static propTypes = {
    rsaKey: PropTypes.bool.isRequired,
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    selected: PropTypes.string,

    handleSizeGet: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
    handleLoadRSAPrivateKey: PropTypes.func.isRequired,
    handleIpfsStorageSelect: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.getCheck()
  }

  componentWillReceiveProps (nextProps) {
    this.getCheck(nextProps)
  }

  getCheck (props = this.props) {
    const { selected, data } = props

    if (data && typeof data.size === 'undefined') props.handleSizeGet(selected)

    if (data && data.size > 0) this.getData(props)
  }

  getData (props = this.props) {
    const {
      selected,
      data: { files, size }
    } = props

    if (size && size != 0 && Object.keys(files).length == 0)
      for (let i = 0; i < size; i++)
        props.handleIndexGet(i, selected)
  }

  renderIndex = () => {
    const { selected } = this.props
    return (
      <div className={ styles.main } >
        <PathIndex address={ selected } />
      </div>
    )
  }

  renderNeedKey = () => (
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
  )

  render () {
    const {
      rsaKey,
      accounts,
      selected
    } = this.props

    return (
      <div className={ styles.container } >
        <div className={ 'row' } >
          <div className={ 'col-xs-12' } >
            <div className={ styles.selectWrapper } >
              <Select.Creatable
                name={ 'Select account' }
                value={ selected }
                options={ accounts }
                onChange={ (v) => this.props.handleIpfsStorageSelect(v.value) }
              />
            </div>
          </div>
          <div className={ 'col-xs-12' } style={{ 'display': 'table' }} >
            {
              rsaKey ?
              this.renderIndex() :
              this.renderNeedKey()
            }
          </div>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SharedIndex)
