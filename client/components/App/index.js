import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import IPFSFileDropper from '../IPFSFileDropper'

import {
  ipfsStorageAddressGet,
  ipfsStorageValueGet,
  ipfsStorageValueSet,
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
    handleValueSet: (v, a) => ipfsStorageValueSet(dispatch, v, a),
    handleSizeGet: () => ipfsStorageSizeGet(dispatch)
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
      value: PropTypes.any
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

  handleValueGet () {
    const getValue = this.textInputGet.value
    if (!getValue || getValue === '') return
    const { size } = this.props.IPFSStorage
    const index = parseInt(getValue)
    this.props.handleValueGet(index)
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
      value
    } = this.props.IPFSStorage
    return (
      <div className="app" >
        <h1>IPFS Storage</h1>

        { address ?
          <div>
            <h4>
              IPFS Storage contract deployed at { address }
              <br />
            </h4>
            { size &&
              <h5>
                Size: { size.toString() }
              </h5>
            }

            { value &&
              <div>
                <hr />
                <br />
                Current value: { value.toString() }
              </div>
            }

            { value ?
              <div>
                <input ref={(i) => { this.textInputSet = i }} />
                <button onClick={ () => { this.handleValueSet() }}>
                  Update Value
                </button>
              </div>
              :
              <div>
                <button onClick={ () => { this.handleValueGet() }}>
                  Get value of contract at index:
                </button>
                <input ref={(i) => { this.textInputGet = i }} />
              </div>
            }
          </div>
          :
          <button onClick={ () => this.props.handleAddressGet() }>
            Get address of contract
          </button>
        }

        <br />
        <hr />
        <br />

        <IPFSFileDropper />

        <br />
        <hr />

        <span className="hint">
          <h4>Hint:</h4>
          Open the browser developer console to
          view <strong>redux state changes</strong>, errors and warnings.
        </span>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App)
