//logging module
var winston = require('winston');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({
        	level: "debug",
           	filename: 'locomyTestDataApp.log',
           	handleExceptions: true,
           	json: true,
           	colorize: false
           	})
    ]
});

module.exports = logger;