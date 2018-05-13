// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
const cors = require('cors');
const gh = process.env.GITHUB_ACCESS_TOKEN;
const getUsername = require('./services/twitter');

const logger = log4js.getLogger(appName);
const app = express();
app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app);

// Add your code here

app.get('/:username', cors(), (req, res) => {
  console.log("Accessing.")
  getUsername(req.params.username, { gh })
    .then(username => res.send(username))
    .catch(err => res.end(err));
});

const port = process.env.PORT || localConfig.port;
app.listen(port, function(){
  logger.info(`brocket listening on http://localhost:${port}/appmetrics-dash`);
  
  logger.info(`brocket listening on http://localhost:${port}`);
  
  
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
})

app.use(function (err, req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '500.html'));
})
