//app/qryHandler.js
//require necessary modules=============================================================
var logger = require('../config/logger');
//generate new credetials for connecting the Amazon API
var Credentials = require('../config/credentials');
var cred = new Credentials('EN');
//generate new OperationsHelper for Amazon Product API
var OperationHelper = require('apac').OperationHelper;
var opHelper = new OperationHelper(cred);
//async
var async = require("async");
//require mongo models with mongo connection
var mongoSetup = require('../config/locomyDB.js');
//require randomCoordinates module and input GeoJson file
var randCoords = require('../app/randomCoordinates');
var coords = new randCoords(require('../config/geo/GeoJson/usa_wgs1984.json'));

function QueryHandler(queryArray){
	this.queryArray = queryArray;
}

//fire requests to Amazon Api and store the data received===================================
//save data from Amazon request to MongoDB
QueryHandler.prototype.saveData = function(results){
		var self = this;
		if(results.ItemSearchResponse.Items[0].TotalResults[0] == '0') {
			logger.log('warn', 'No result from makeRequest!');
			return;}
		else {
			var itemArray = results.ItemSearchResponse.Items[0].Item;
			async.each(itemArray, function(item, next){
				var tempCoords = coords.getCoords();
				var newItem = new mongoSetup.products({
						id: item.ASIN[0],
						category_id: item.BrowseNodes[0].BrowseNode[0].BrowseNodeId[0],
						category: item.BrowseNodes[0].BrowseNode[0].Name[0],
						title: self.noTitle (item.ItemAttributes[0].Title),
						description: self.undefinedField (item.ItemAttributes[0].Feature),
						image_link: self.noPictureHandler (item.MediumImage),
						//brand = manufacturere field from Amazon
						brand: self.noManufacHandler (item.ItemAttributes[0].Manufacturer),
						price: self.undefinedPrices (item.ItemAttributes[0].ListPrice),
						x: tempCoords[0],
						y: tempCoords[1]
						})
						newItem.save(function(err){
							if(err) logger.log('debug',err);
							else {logger.log('debug', newItem.title);
							next();}
						});
					}, function(){
						logger.log('debug', "All items saved to MongoDB!");
					});	
		return;}}
/*batch query all requests from the array and then wirte
the result to mongoDB; after do a timeout...*/
QueryHandler.prototype.runQueries = function(){
	var self = this;
	//dequeue query array
	var query = this.queryArray.pop();
	//get time when function is started
	var hrStart = process.hrtime();
	if(query){
		this.makeRequest(query).then(function(results, err){
			logger.log('info',"function makeRequest: "+ query.SearchIndex +", "+ query.Title);
			/*here is the entry point for the saveData function, which writes to MongoDB
			in my case*/
			self.saveData(results);
			//get time between request initiation and saving in MonogDB
			var diff = process.hrtime(hrStart);
			setTimeout(function(){
			self.runQueries();
			/*set query delay according to time elapsed	since last
			query minus query delay expected by Amazon server*/	
			}, 1001 - ((diff[0]*1000) + (diff[1]/1000000)));
			/*if makeRegquest promise is rejected, check for 503 error,
			check for undefined error, print errors and in any case 
			restart runQueries function to make the next request*/
			}).catch(function(err){
				if(err.statusCode == 503){
					logger.log('error', "Error 503!");
					self.runQueries();}
				else if (err.statusCode == undefined) {
					logger.log('error', err);
					self.runQueries();}
			});
		}
		else {
			console.log("All queries processed!");
			return;
		}	
	}
//make a request and resolve the result
QueryHandler.prototype.makeRequest = function(query){
	return new Promise(function(resolve, reject){
		opHelper.execute('ItemSearch', query, function(err, results){
			if(err) return reject(err)
			else resolve(results)
			});
	});
}
//change querystate of request in MongoDB after sending request to Amazon========
QueryHandler.prototype.chnageQryState = function(query){

	//content

}
//error handling=================================================================
//handle problems with undefined title
QueryHandler.prototype.noTitle = function(titleLink){
		if(titleLink == undefined){return '';}
		else{return titleLink[0];}
	}
//handle problem with undefined item properties
QueryHandler.prototype.undefinedField = function(field){
		var value = String;
	 		if (field == undefined) {value ="";}
		 		else if (field.constructor == Array) {value = field.join(',');}
		 		else if (field.constructor == Object) {value = field;}
			 	return value;
	}
//handle problems with undefined prices
QueryHandler.prototype.undefinedPrices = function(price){
		if(price == undefined) {return ''}
		else {return price[0].Amount[0]}
	}
//handle problems for products without a picture
QueryHandler.prototype.noPictureHandler = function(picturelink){
		if(picturelink == undefined) {return "";}
		else {return picturelink[0].URL[0];}s
	}
//handle problems for products without manufacturer
QueryHandler.prototype.noManufacHandler = function(manufLink){
		if(manufLink == undefined){return "";}
		else{return manufLink[0];}
	}
//export query class
module.exports = QueryHandler;
//export mongoose model
module.exports.mongoSetup = mongoSetup;
