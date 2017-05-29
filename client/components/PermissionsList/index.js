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
    parties: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired
  }

  getParties () {
    let parties = []
    for (const p in this.props.parties)
      parties.push(this.props.parties[p])
    return parties
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
              Read
            </div>
          </div>
          <div className='col-xs-1' >
            <div className={ styles.headerWrite } >
              Write
            </div>
          </div>
          {
            this.getParties().map((p) =>
              <div key={ p.address } className='col-xs-12' >
                <div className='row' >
                  <div className='col-xs-10' >
                    <div className={ styles.colAddress } >
                      { p.address }
                    </div>
                  </div>
                  <div className='col-xs-1' >
                    <div className={ styles.colRead } >
                      { p.permissions % 2 === 1 ? '✔️' :  ' ' }
                    </div>
                  </div>
                  <div className='col-xs-1' >
                    <div className={ styles.colWrite } >
                      { p.permissions % 4 >= 2 ? '✔️' : '  ' }
                    </div>
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
