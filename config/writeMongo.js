//config/qrysToMongoDB.js
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
function WriteMongo(apiCode){
	this.apiCode = apiCode;
	function getJson(){
		if(_this.apiCode == 'DE') return require('./searchParams_DE.json');
		else if(_this.apiCode == 'US') return require('./searchParams_US.json');
		else {logger.log('debug', 'Something went wrong loading query template (json)!'); return;}
	}
	function getCollection(){
		if(_this.apiCode == 'DE') return 'queries_DE';
		else if(_this.apiCode == 'US') return 'queries_US';
		else {logger.log('debug', "Wrong ApiCode!"); return;}
	}
	var _this = this;
	this.queryBuilder = new queryFactory(getJson(), 500);
	this.collection = getCollection();
}
WriteMongo.prototype.qrysToMongo = function (){
	var _this = this;
//remove all queries from MongoDB collection before generating new queries
	switch(this.collection){
	case 'queries_DE':
		queryDB.queries_DE.remove({}, function(err){
			if(err)logger.log('error', err);
			else logger.log('info', "All queries of collection queries_DE initially removed!");
			return;
		});
		break;
	case 'queries_US':
		queryDB.queries_US.remove({}, function(err){
				if(err)logger.log('error', err);
				else logger.log('info', "All queries of collection queries_US initially removed!");
				return;
			});
			break;
}
//execute query building method of queryFactory class
	var queries = this.queryBuilder.multiReqByTitle();
	async.each(queries, function(query, next){
		switch (_this.collection){
			case 'queries_DE':
		var newQuery = new queryDB.queries_DE({
			SearchIndex: query.SearchIndex,
			Title: query.Title,
			MinimumPrice: query.MinimumPrice,
			MaximumPrice: query.MaximumPrice,
			Keywords: query.Keywords,
			ResponseGroup: query.ResponseGroup,
			sort: query.sort,		
			queryState: false,
			fetchedItems: 0,
			query_id: queries.indexOf(query)
			});
			break;
			case 'queries_US':
			var newQuery = new queryDB.queries_US({
			SearchIndex: query.SearchIndex,
			Title: query.Title,
			MinimumPrice: query.MinimumPrice,
			MaximumPrice: query.MaximumPrice,
			Keywords: query.Keywords,
			ResponseGroup: query.ResponseGroup,
			sort: query.sort,		
			queryState: false,
			fetchedItems: 0,
			query_id: queries.indexOf(query)
			});
			break;
		};
		newQuery.save(function(err){
			if(err) logger.log('debug', err);
			else {logger.log('debug', newQuery.Title);
			next();}
		});
	}, function(){
		if(_this.collection == 'queries_DE') logger.log('debug', 'All queries for German API saved to Mongo');
		else if(_this.collection == 'queries_US') logger.log('debug', 'All queries for US API saved to Mongo');
		else logger.log('debug', "Something went wrong writing to Mongo");
		return;
	});
}

//export class
module.exports = WriteMongo;
//export mongoose model for queriesDB
module.exports.queryDB = queryDB;