//config/queryMongo.js
//write queries from QueryBuilder to MongoDB
//require necessary modules=====================================
//require logger
var logger = require('./logger');
//require async
var async = require('async');
//require db connection + mongoose mode for queries
var queryDB = require('./queryDB');
//requrire the query factory class
var queryFactory = require('../app/qrybuilder');
//create a new instance of the queryFactory class
//var QueryBuilder = new queryFactory(require('./searchParams_EN.json'));
//class constructor
function QueryMongo(params){
	this.collection = params.collection;
	this.queryBuilder = new queryFactory(params.json);
}
/////////////////////////////////seprate write and save module
QueryMongo.prototype.queriesToMongoDB = function (){
//execute query building method of queryFactory class
	var queries = queryBuilder.multiReqByTitle();
	async.each(queries, function(query, next){
		var newQuery = new queryDB.this.collection({
			SearchIndex: query.SearchIndex,
			Title: query.Title,
			MinimumPrice: query.MinimumPrice,
			MaximumPrice: query.MaximumPrice,
			Keywords: query.Keywords,
			ResponseGroup: query.ResponseGroup,
			sort: query.sort,		
			queryState: false,
			query_id: queries.indexOf(query)
			});
		newQuery.save(function(err){
			if(err) logger.log('debug', err);
			else {logger.log('debug', newQuery.Title);
			next();}
		});
	}, function(){
		logger.log('debug', "All queries stored in MongoDB");
		return;
	});
}
//getQueries back from MongoDB for requesting Amazon server
	QueryMongo.prototype.getQueries = function(callback){
		queryDB.this.collection.find({'queryState': false}, function(err, doc){
			if(err){console.log(err);
				return;
			}
			else {
				callback(doc);
				console.log("getQueries returned!");
				return;
			}
		});
	}
//export class
module.exports = QueryMongo;
//export mongoose model for queriesDB
module.exports.queryDB = queryDB;