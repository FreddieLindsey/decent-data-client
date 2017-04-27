import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import cors from 'cors'

import {
  default_,
  ipfs
} from './routes'

// Setup application
const app = express();
if (process.env.NODE_ENV === 'development') {
  console.log('Running DEV mode')
  app.use(logger('dev'));
  app.use(cors()) // TODO: Decide on CORS for production
}

// Use bodyparser to get data from a POST
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Enable routes
app.use('/', default_)
app.use('/ipfs', ipfs)

// Set the port binding
const port = process.env.API_PORT || 8000;

console.log('API listening on port ' + port)
app.listen(port)

export default app
