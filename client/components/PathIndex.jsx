import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import PathItem from './PathItem'

import styles from './PathIndex.scss'

const mapStateToProps = (state, ownProps) => {
  const address = ownProps.address
  const canShare = address === state.security.address
  const { files } = state.IPFSStorage.identities[address]
  return {
    address,
    canShare,
    files,
    size: Object.keys(files).length
  }
}

const mapDispatchToProps = (dispatch) => ({})

class PathIndex extends Component {

  static displayName = 'Path Index'
  static propTypes = {
    address: PropTypes.string.isRequired,
    canShare: PropTypes.bool.isRequired,
    files: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired
  }

  renderRows = () => (
    <div className={ styles.list } >
      {
        Object.keys(this.props.files).map((k) => (
          <PathItem
            key={k}
            share={ this.props.canShare }
            address={ this.props.address }
            path={ this.props.files[k].path } />
        ))
      }
    </div>
  )

  render () {
    const { size } = this.props

    return (
      <div className={ styles.container } >
        <div className={ styles.header } >
          <div className='row' >
            <div className='col-xs-2' >
              Type
            </div>
            <div className='col-xs-10' >
              Path
            </div>
          </div>
        </div>
        {
          size > 0 ?
          this.renderRows() :
          <div className={ styles.noFiles }>
            <hr />
            No files available
            <hr />
          </div>
        }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PathIndex)
