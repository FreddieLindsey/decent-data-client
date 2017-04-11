import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FileMetadataList from '../FileMetadataList'
import FileDropper from '../FileDropper'

import {
  ipfsStorageAddressGet,
  ipfsStorageValueGet,
  ipfsStorageValueAdd,
  ipfsStorageSizeGet
} from '../../actions'

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    IPFSStorage: state.IPFSStorage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleAddressGet: () => ipfsStorageAddressGet(dispatch),
    handleValueGet: (i) => ipfsStorageValueGet(dispatch, i),
    handleValueSet: (v, a) => ipfsStorageValueAdd(dispatch, v, a),
    handleSizeGet: (done) => ipfsStorageSizeGet(dispatch, done)
  }
}

class App extends Component {

  static displayName = 'App'
  static propTypes = {
    accounts: PropTypes.shape({
      all: PropTypes.arrayOf(PropTypes.string),
      default: PropTypes.string
    }).isRequired,
    IPFSStorage: PropTypes.shape({
      address: PropTypes.string,
      size: PropTypes.number,
      values: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,

    handleAddressGet: PropTypes.func.isRequired,
    handleValueGet: PropTypes.func.isRequired,
    handleValueSet: PropTypes.func.isRequired,
    handleSizeGet: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.handleAddressGet()
    this.props.handleSizeGet()
  }

  getValues() {
    const { size } = this.props.IPFSStorage
    for (let i = 0; i < size; i++) {
      this.props.handleValueGet(i)
    }
  }

  handleValueSet () {
    let newValue = this.textInputSet.value
    if (!newValue || newValue === '') return
    this.props.handleValueSet(newValue, this.props.accounts.default)
  }

  render () {
    const {
      address,
      size,
      values
    } = this.props.IPFSStorage
    if (size !== undefined && size !== 0 && values.length === 0)
      this.getValues()
    return (
      <div className="app" >
        <h1>IPFS Storage</h1>

        { address &&
          <div>
            <h4>
              IPFS Storage contract deployed at { address }
            </h4>
            { size !== undefined &&
              <h5>
                Size: { size }
              </h5>
            }

            { values !== undefined && values.length > 0 &&
              <ul>
                <li>ITEM</li>
              </ul>
            }
          </div>
        }

        <br />
        <hr />
        <br />

        <FileMetadataList />

        <br />
        <hr />
        <br />

        <FileDropper />
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App)
