import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

class ShareAdminPage extends Component {

  static displayName = 'Share Admin Page'

  render () {
    return (
      <div>
        Sharing Page
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ShareAdminPage)
