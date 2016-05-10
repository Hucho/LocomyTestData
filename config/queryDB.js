//config/queryDB.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uri = 'mongodb://localhost/queriesdb';

function queryDB(mongoose, Schema){
//connect to database
var db1 = mongoose.createConnection(uri);
db1.on('error', console.error);
db1.once('open', function(){console.log('Connection to QueryDB successfully established')});
//define queriesdb model
var query_US = new Schema ({
	SearchIndex: String,
	Title: String,
	MinimumPrice: Number,
	//set number in Euro/Dollar cents to set the increment between two queries
	MaximumPrice: Number,
	Keywords: String,
	ResponseGroup: String,
	sort: String,
	queryState: Boolean,
	fetchedItems: Number,
	query_id: Number
	}, {collection: 'queries_US'});

var query_DE = new Schema ({
	SearchIndex: String,
	Title: String,
	MinimumPrice: Number,
	//set number in Euro/Dollar cents to set the increment between two queries
	MaximumPrice: Number,
	Keywords: String,
	ResponseGroup: String,
	sort: String,
	queryState: Boolean,
	fetchedItems: Number,
	query_id: Number
	}, {collection: 'queries_DE'});

var models = {
	queries_US: db1.model('queries_US', query_US),
	queries_DE: db1.model('queries_DE', query_DE),
}
return models;
}
module.exports = queryDB(mongoose, Schema);