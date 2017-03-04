import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)

import app from '../../server'

global.app = app
global.chai = chai
global.request = (server) => server ? chai.request(server) : chai.request(app)
global.expect = expect
