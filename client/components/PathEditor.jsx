import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './PathEditor.scss'

import {
  fileChangePath
} from '../actions'

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

  constructor(props) {
    super(props)
    this.state = {
      value: props.path
    }
  }

  handleUpdateFilePath = (value) => {
    this.setState({
      value
    })
  }

  handleSubmitFilePath = () => {
    if (this.props.path !== this.state.value) {
      this.props.handleFileChangePath(this.props.path, this.state.value.trim())
    }
  }

  render () {
    const {
      value
    } = this.state

    return (
      <input
        className={ styles.container }
        value={ value }
        onChange={ (e) => this.handleUpdateFilePath(e.target.value) }
        onBlur={ () => this.handleSubmitFilePath() }
      />
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PathEditor)
