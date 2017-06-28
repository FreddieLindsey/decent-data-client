import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'
import Select from 'react-select'

import EncryptionKeyRequired from '../components/EncryptionKeyRequired'
import PathIndex from '../components/PathIndex'

import styles from './Shared.scss'
import 'react-select/dist/react-select.css'

import {
  ipfsStorageSizeGet,
  ipfsStorageSizeGetGroup,
  ipfsStorageIndexGet,
  ipfsStorageIndexGetGroup,
  ipfsStorageSelect,
  loadEncryptionKeys,
} from '../actions'

const mapStateToProps = (state) => {
  const selected = state.IPFSStorage.selected
  return {
    encryptionKey: !!state.security.encryption.secretKey,
    selected,
    accounts: Object
      .keys(state.IPFSStorage.identities)
      .filter((v) => v !== state.security.address).map(v => ({
        label: v,
        value: v
      })),
    data: state.IPFSStorage.identities[selected]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSizeGet: (a) => dispatch(ipfsStorageSizeGet(a)),
    handleSizeGetGroup: (a, g) => dispatch(ipfsStorageSizeGetGroup(a, g)),
    handleIndexGet: (i, a) => dispatch(ipfsStorageIndexGet(i, a)),
    handleIndexGetGroup: (i, a, n) => dispatch(ipfsStorageIndexGetGroup(i, a, n)),
    handleLoadEncryptionKeys: (f) => dispatch(loadEncryptionKeys(f)),
    handleIpfsStorageSelect: (v) => dispatch(ipfsStorageSelect(v))
  }
}

const initialState = {
  type: {
    available: [
      { value: 0, label: 'Individual' },
      { value: 1, label: 'Group' },
    ],
    selected: 0
  }
}

class SharedIndex extends Component {

  static displayName = 'Shared'
  static propTypes = {
    encryptionKey: PropTypes.bool.isRequired,
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    selected: PropTypes.string,

    handleSizeGet: PropTypes.func.isRequired,
    handleSizeGetGroup: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
    handleIndexGetGroup: PropTypes.func.isRequired,
    handleLoadEncryptionKeys: PropTypes.func.isRequired,
    handleIpfsStorageSelect: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { ...initialState }
  }

  componentWillMount() {
    this.getCheck(this.props)
  }

  componentWillReceiveProps (props) {
    this.getCheck(props)
  }

  getCheck (props) {
    const { selected, data } = props
    const { type } = this.state

    if (data && data.size < 0)
      type.selected === 0 ?
        props.handleSizeGet(selected) :
        props.handleSizeGetGroup(selected, type.groupName)

    if (data && data.size > 0) this.getData(props)
  }

  getData (props) {
    const {
      selected,
      data: { files, size }
    } = props
    const { type } = this.state

    if (size && size != 0 && Object.keys(files).length !== size)
      for (let i = 0; i < size; i++)
        type.selected === 0 ?
          props.handleIndexGet(i, selected) :
          props.handleIndexGetGroup(i, selected, type.groupName)
  }

  renderIndex = () => {
    const { selected } = this.props
    return (
      <div className={ styles.main } >
        <PathIndex address={ selected } />
      </div>
    )
  }

  renderNeedKey = () => <EncryptionKeyRequired />

  render () {
    const {
      encryptionKey,
      accounts,
      selected
    } = this.props

    const { type } = this.state

    return (
      <div>
        <div className={ 'row' } >
          <div className={ 'col-xs-12' } >
            <div className={ styles.selectWrapper } >
              <Select
                name={ 'Select account type' }
                value={ type.available[type.selected] }
                options={ type.available }
                onChange={ (v) => this.setState({ type: { ...type, selected: v.value } }) }
              />
            </div>
          </div>
          {
            type.selected !== 0 &&
            <div className={ 'col-xs-12' } >
              <div className={ styles.selectWrapper } >
                <input
                  className={ styles.groupName }
                  placeholder={ 'Enter Group Name' }
                  value={ type.groupName }
                  onChange={ (e) =>
                    this.setState({ type: { ...type, groupName: e.target.value }}) }/>
              </div>
            </div>
          }
          <div className={ 'col-xs-12' } >
            <div className={ styles.selectWrapper } >
              <Select.Creatable
                name={ 'Select account' }
                value={ selected }
                options={ accounts }
                onChange={ (v) =>
                  this.props.handleIpfsStorageSelect(v && v.value || v) }
              />
            </div>
          </div>
          {
            selected ?
            <div className={ 'col-xs-12' } style={{ 'display': 'table' }} >
              {
                encryptionKey ?
                this.renderIndex() :
                this.renderNeedKey()
              }
            </div> :
            <div className={ 'col-xs-12' } >
              Please provide an address { type.selected === 1 && ' and group name'} to query above.
            </div>
          }
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SharedIndex)
