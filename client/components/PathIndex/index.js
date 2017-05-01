import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import PathItem from '../PathItem'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => {
  const files = state.files.stored
  const size = Object.keys(files).length
  return {
    size,
    files
  }
}

const mapDispatchToProps = (dispatch) => ({})

class PathIndex extends Component {

  static displayName = 'Path Index'
  static propTypes = {
    files: PropTypes.shape().isRequired,
    size: PropTypes.number.isRequired
  }

  renderRows = () => (
    <div className={ styles.list } >
      {
        Object.keys(this.props.files).map((k) => (
          <PathItem key={k} path={k} />
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
            <div className='col-xs-8' >
              Path
            </div>
            <div className='col-xs-2' >
              Sharing
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
