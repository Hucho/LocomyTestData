//config/queryDB.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function queryDB(mongoose, Schema){
//connect to database
var db1 = mongoose.createConnection('mongodb://localhost/queriesdb');
db1.on('error', console.error);
db1.once('open', function(){console.log('Connection to QueryDB successfully established')});
//define queriesdb model
var query = new Schema ({
	SearchIndex: String,
	Title: String,
	MinimumPrice: Number,
	//set number in Euro/Dollar cents to set the increment between two queries
	MaximumPrice: Number,
	Keywords: String,
	ResponseGroup: String,
	sort: String,
	queryState: Boolean,
	query_id: Number
});
var model = {
	queries: db1.model('queries', query)
}
return model;
}
module.exports = queryDB(mongoose, Schema);