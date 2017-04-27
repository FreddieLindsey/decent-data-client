import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FileViewer from '../FileViewer'
import FileMetadataList from '../FileMetadataList'
import FileDropper from '../FileDropper'

import {
  ipfsStorageAddressGet,
  ipfsStorageSizeGet,
  ipfsStorageIndexGet,
  fileRetrieve,
} from '../../actions'

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    files: state.files.stored,
    IPFSStorage: state.IPFSStorage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleAddressGet: () => ipfsStorageAddressGet(dispatch),
    handleSizeGet: () => ipfsStorageSizeGet(dispatch),
    handleIndexGet: (i) => ipfsStorageIndexGet(dispatch, i),
    handleFileRetrieve: (path) => fileRetrieve(dispatch, path),
  }
}

class App extends Component {

  static displayName = 'App'
  static propTypes = {
    accounts: PropTypes.shape({
      all: PropTypes.arrayOf(PropTypes.string),
      default: PropTypes.string
    }).isRequired,
    files: PropTypes.object.isRequired,
    IPFSStorage: PropTypes.shape({
      address: PropTypes.string,
      size: PropTypes.number
    }).isRequired,

    handleAddressGet: PropTypes.func.isRequired,
    handleSizeGet: PropTypes.func.isRequired,
    handleIndexGet: PropTypes.func.isRequired,
    handleFileRetrieve: PropTypes.func.isRequired,
  }

  componentDidMount () {
    this.props.handleAddressGet()
    this.props.handleSizeGet()
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

    for (const k in files) {
      let item = files[k]
      if (item.index !== undefined && !item.retrieving && !item.retrieved) {
        this.props.handleFileRetrieve(k)
      }
    }
  }

  render () {
    const {
      address,
      size
    } = this.props.IPFSStorage

    const {
      files
    } = this.props

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
          </div>
        }

        <br />
        <hr />
        <br />

        <button onClick={ () => this.getData() }>DATA</button>
        <FileViewer />

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
