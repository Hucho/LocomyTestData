//config/queryMongo.js
//write queries from QueryBuilder to MongoDB
//require necessary modules=====================================
//require logger
var logger = require('./logger');
//require async
var async = require('async');
//require db connection + mongoose mode for queries
var queryDB = require('./queryDB');

function QueryMongo(query){

	this.query = query;
}
	QueryMongo.prototype.queriesToMongoDB = function (){
	//requrire the query factory class
	var queryFactory = require('../app/qrybuilder');
	//create a new instance of the queryFactory class
	var QueryBuilder = new queryFactory(require('./searchParams_EN.json'));
	//exectur query building method of queryFactory class
	var queries = QueryBuilder.multiReqByTitle();


	async.each(queries, function(query, next) {
		var newQuery = new queryDB.queries({
			SearchIndex: query.SearchIndex,
			Title: query.Title,
			MinimumPrice: query.MinimumPrice,
			//set number in Euro/Dollar cents to set the increment between two queries
			MaximumPrice: query.MaximumPrice,
			Keywords: query.Keywords,
			ResponseGroup: query.ResponseGroup,
			sort: query.sort,
			queryState: false,
			query_id: queries.indexOf(query)
		})
		newQuery.save(function(err){
			if(err) logger.log('debug', err);
			else {logger.log('debug', newQuery.Title);
			next();}
		});
	}, function(){
		logger.log('debug', "All queries stored in MongoDB");
	});
	}

	//queriesToMongoDB();
	QueryMongo.prototype.getQueries = function(callback){
		queryDB.queries.find({'SearchIndex': 'All'}, function(err, doc){
			if(err){console.log(err);
				return;
			}
			else {
				callback(doc);
				return;
			}
		});
	}

module.exports = QueryMongo;