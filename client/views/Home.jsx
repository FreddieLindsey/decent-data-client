import React, { Component, PropTypes } from 'react'

import styles from './Home.scss'

export default class Home extends Component {

  renderProperties = () => (
    <div className='row' >
      <h3 className='col-xs-12' style={{ textAlign: 'center' }} >Principals</h3>
      <div className='col-xs-12 col-sm-6' >
        <div className={ styles.property } >
          <h4>
            Decentralised
          </h4>
          <p>
            There is no central authority managing your data.
            Your data exists nowhere, yet it exists everywhere.
            There are no limits from country-specific firewalls or any censorship.
          </p>
        </div>
      </div>
      <div className='col-xs-12 col-sm-6' >
        <div className={ styles.property } >
          <h4>
            Encrypted
          </h4>
          <p>
            Under keys that you control, your data is encrypted when it leaves your browser.
            Data retrieved from the network is encrypted until it reaches you.
            It is not possible for anyone to snoop on your data.
          </p>
        </div>
      </div>
    </div>
  )

  renderTechnologies = () => (
    <div className='row' >
      <h3 className='col-xs-12' style={{ textAlign: 'center' }} >Technology</h3>
      <div className='col-xs-12 col-sm-6'>
        <div className={ styles.technology } >
          <h4>
            IPFS
          </h4>
          <p>
            IPFS is a distributed storage provider. Anything stored on IPFS is available anywhere
            and does not rely on a centralised network (such as the internet) to function.
          </p>
        </div>
      </div>
      <div className='col-xs-12 col-sm-6'>
        <div className={ styles.technology } >
          <h4>
            Ethereum
          </h4>
          <p>
            Ethereum is the decentralised compute backbone. It provides a durable state
            transition system, cryptographically secured.
          </p>
        </div>
      </div>
    </div>
  )

  render () {
    return (
      <div>
        <h2>
          Private Storage
        </h2>
        <p>
          The privacy of your data, determined by you.
        </p>
        <hr />
        <div className={ styles.propertyWrapper } >
          { this.renderProperties() }
        </div>
        <hr />
        <div className={ styles.technologyWrapper } >
          { this.renderTechnologies() }
        </div>
      </div>
    )
  }

}
