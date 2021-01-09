const _ = require('lodash')
const config = require('config')
const express = require('express')
const SSEManager = require('sse-nodejs')
const Logger = require('./lib/logger')
const DailyJobManager = require('./lib/job/dailyJob');
const expressValidator = require('express-validator');
const SocketManager = require('./lib/socket');

// Global variables
global.logger = Logger(`${__dirname}/logs`);
global.util = require('util');
global.SSE = new SSEManager({
  heartbeat: 15000,
  retry: 10000
});

// global.googleMapsClient = require('@google/maps').createClient({
//   key: _.get(config, 'google.apiKey', '')
// });

// Middleware
const bodyParser = require('body-parser')
const logParamsMiddleware = require('./lib/middleware/logParams');


// Handle routes
// Start server, socket
const app = express();
const server = require('http').Server(app);

app.use(bodyParser.json());
app.use(expressValidator());
app.use(logParamsMiddleware);

// Routes


const port = _.get(config, 'port', 3000);
server.listen(port, () => {
  logger.logInfo('Server listening at port:', port)
});

process.on('uncaughtException', (err) => {
  logger.logError('uncaughtException', err)
});
