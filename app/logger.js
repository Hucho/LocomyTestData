//logging module
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true}),
    new (winston.transports.File)({
      filename: "locomyTestDataApp.log",
      level: "info",
      colorize: true
    })

  ]
});

module.exports = logger;