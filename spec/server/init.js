// IMPORTS
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)

import fs from 'fs'

import app from '../../server'

// LOGIC

const nyancat_gif  = fs.readFileSync('./spec/server/assets/nyancat.gif')
const text  = fs.readFileSync('./spec/server/assets/text')
const text_txt  = fs.readFileSync('./spec/server/assets/text.txt')

// SET GLOBALS

global.app = app
global.chai = chai
global.Request = (server) => server ? chai.request(server) : chai.request(app)
global.expect = expect

global.files = {
  nyancat_gif,
  text,
  text_txt
}
