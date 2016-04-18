//config/db.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.createConnection('mongodb://localhost/locomyDB');

db.on('error', console.log.bind(console, 'connection error: '));
db.once('open', function callback (){
	console.log('Successfully connected to MongoDB with required module!');
})

var models = require('../app/locomyDB.js')(mongoose, Schema);

var MongoDB_product = db.models;

module.exports = MongoDB_product;