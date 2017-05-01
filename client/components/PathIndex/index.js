import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import PathItem from '../PathItem'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => {
  return {
    files: {
      ...state.files.stored
    }
  }
}

const mapDispatchToProps = (dispatch) => ({})

class PathIndex extends Component {

  static displayName = 'Path Index'
  static propTypes = {
    files: PropTypes.shape().isRequired
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
        { this.renderRows() }
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PathIndex)
