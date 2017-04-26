import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FileViewer from '../FileViewer'
import FileMetadataList from '../FileMetadataList'
import FileDropper from '../FileDropper'

import {
  ipfsStorageAddressGet,
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
    handleSizeGet: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.handleAddressGet()
    this.props.handleSizeGet()
  }

  render () {
    const {
      address,
      size,
      values
    } = this.props.IPFSStorage
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
