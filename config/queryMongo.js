//config/queryMongo.js
//write queries from QueryBuilder to MongoDB
//require necessary modules=====================================
//require logger
var logger = require('./logger');
//require db connection + mongoose mode for queries
var queryDB = require('./queryDB');
//class constructor
function QueryMongo(apiCode){
	this.apiCode = apiCode;
	function getCollection(){
		if(_this.apiCode == 'DE') return 'queries_DE';
		else if(_this.apiCode == 'US') return 'queries_US';
		else {logger.log('debug', "Wrong ApiCode!"); return;}
	}
	var _this = this;
	this.collection = getCollection();

}
//create query based on apiCode
QueryMongo.prototype.getQuery = function(){
	if (this.apiCode == 'DE'){
		var query = queryDB.queries_DE.find({'queryState': false});
		return query;
	}
	else if(this.apiCode == 'US'){
		var query = queryDB.queries_US.find({'queryState': false});
		return query;
	}
	else{logger.log('debug', 'Could not get query!'); return;}
}
/*callback for getQueries method, which takes the queries from MongoDB,
fires them to the Amazon Server and stores them in the locomy MongoDB*/
QueryMongo.prototype.callback = function (doc){
	var tempArray = doc;
	console.log(tempArray.length +" queries fetched from MongoDB");
	var queryArray = [];
	var queryInfoArray = [];
	tempArray.map(function(query){
		queryArray.push({
		'SearchIndex': query.SearchIndex,
		'Title': query.Title,
		'MinimumPrice': query.MinimumPrice,
		'MaximumPrice': query.MaximumPrice,
		'Keywords': query.Keywords,
		'ResponseGroup': query.ResponseGroup,
		'sort': query.sort
		});
		queryInfoArray.push({
		'query_id': query.query_id
		});
	});
	//require QueryHandler class
	var QueryHandler = require('../app/qryHandler');
	var queryRun = new QueryHandler(queryArray, queryInfoArray, this.apiCode);
	queryRun.runQueries();
}
//getQueries back from MongoDB and request Amazon server
	QueryMongo.prototype.getAmzData = function(){
		var _this = this;
		var query = this.getQuery();
		query.exec(function(err, doc){
			if(err){console.log(err);
				return;
			}
			else {
				_this.callback(doc);
				console.log("getQueries returned!");
				return;
			}
		});
	}

//export class
module.exports = QueryMongo;
//export mongoose model for queriesDB
module.exports.queryDB = queryDB;