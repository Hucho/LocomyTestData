//app/taskmanager.js
//taskmanager for initiating and running the query tasks
//require logger
var logger = require('../config/logger');
//async
var async = require("async");
/*require locomyDB model from qryHandler module,
because it can only be once compiled*/
var mongoSetup = require('./qryHandler').mongoSetup;
//require module for generating queries and writing them to MongoDB
var writeMongo = require('../config/writeMongo');
/*require module for getting all queries back from MongoDB, sending them to Amazon
and storing the result again in MongoDB*/
var queryMongo = require('../config/queryMongo');

function TaskManager (initCodeQueries, initCodeitems){
	this.initCodeQueries = initCodeQueries;
	this.initCodeitems = initCodeitems;
}
TaskManager.prototype.init = function() {
		if(this.initCodeitems == 0){logger.log('debug', "Querying can be continued...");
			return;}
			else if(this.initCodeitems == 1){
						mongoSetup.products.remove({}, function(err){
							if(err) logger.log('error', err);
							else logger.log('debug', "All products removed from MongoDB on start-up!");
						});
						mongoSetup.product_categorys.remove({}, function(err){
							if(err) logger.log('error', err);
							else logger.log('debug', "All categories removed from MongoDB on start-up!");
						});
						return;}
			else {logger.log('debug', "No valid initCode entered!");
				return;}	
		}
TaskManager.prototype.CreateQueries = function(apiCode){
	if(this.initCodeQueries == 1){
			var MongoWriter = new writeMongo(apiCode);
			MongoWriter.qrysToMongo();}
	else if(this.initCodeQueries = 0) logger.log('debug', 'Continue querying...');
	else logger.log('error', 'No valid initCode for dealing with queries entered!');
return;
}
TaskManager.prototype.RunQueries = function(apiCode){
		var productData = new queryMongo(apiCode);
		productData.getAmzData();
return;
}
module.exports = TaskManager;