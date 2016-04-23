//logging module
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: "debug",
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      exitOnError: false
    }),
    new (winston.transports.File)({
      filename: "locomyTestDataApp.log",
      level: "info",
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      exitOnError: false
    })

  ]
});

module.exports = logger;