// IMPORTS
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)

import fs from 'fs'

import app from '../../server'

// LOGIC

const text = fs.readFileSync('./spec/server/assets/text')

// SET GLOBALS

global.app = app
global.chai = chai
global.request = (server) => server ? chai.request(server) : chai.request(app)
global.expect = expect

global.files = {
  text
}
