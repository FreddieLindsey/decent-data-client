import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

import {
  fileChangePath
} from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  path: ownProps.path
})

const mapDispatchToProps = (dispatch) => ({
  handleFileChangePath: (o, n) => dispatch(fileChangePath(o, n))
})

class PathEditor extends Component {

  static displayName = 'Path Editor'
  static propTypes = {
    path: PropTypes.string.isRequired,
    handleFileChangePath: PropTypes.func.isRequired
  }

  render () {
    const {
      path,
      handleFileChangePath
    } = this.props

    return (
      <input
        className={ styles.container }
        value={ path }
        onChange={ (e) => handleFileChangePath(path, e.target.value) }
      />
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PathEditor)
