// IMPORTS
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)

import fs from 'fs'

import app from '../../server'

// SET GLOBALS

global.app = app
global.chai = chai
global.Request = (server) => server ? chai.request(server) : chai.request(app)
global.expect = expect

global.files = {}
const assets = './assets'
const files = fs.readdirSync(assets)
for (const i in files) {
  const filename = files[i]
  global.files[filename] = fs.readFileSync(assets + '/' + filename)
}
