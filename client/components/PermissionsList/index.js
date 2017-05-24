import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './index.scss'

const mapStateToProps = (state, ownProps) => ({
  ...state.files.stored[ownProps.path].sharing
})

const mapDispatchToProps = (dispatch) => ({})

class PermissionsList extends Component {

  static displayName = 'Permissions List'
  static propTypes = {
    parties: PropTypes.arrayOf(PropTypes.shape({
      address: PropTypes.string.isRequired,
      permissions: PropTypes.number.isRequired
    })).isRequired,
    size: PropTypes.number.isRequired
  }

  render () {
    return (
      <div className={ styles.main } >
        <div className='row' >
          <div className='col-xs-10' >
            <div className={ styles.headerAddress } >
              Address
            </div>
          </div>
          <div className='col-xs-1' >
            <div className={ styles.headerRead } >
              R
            </div>
          </div>
          <div className='col-xs-1' >
            <div className={ styles.headerWrite } >
              W
            </div>
          </div>
          {
            this.props.parties.map((p) =>
              <div key={ p.address } className='col-xs-12' >
                <div className='row' >
                  <div className='col-xs-10' >
                    { p.address }
                  </div>
                  <div className='col-xs-1' >
                    { p.permissions % 2 === 1 ? '✔️' : ' ' }
                  </div>
                  <div className='col-xs-1' >
                    { p.permissions % 4 >= 2 ? '✔️' : ' ' }
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsList)
