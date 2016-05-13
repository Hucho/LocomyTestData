//app/qryHandler.js
//require necessary modules=============================================================
var logger = require('../config/logger');
//generate new credetials for connecting the Amazon API
var Credentials = require('../config/credentials');
var cred = new Credentials('US');
//require OperationsHelper for Amazon Product API
var OperationHelper = require('apac').OperationHelper;
//async
var async = require("async");
//require mongo models with mongo connection
var mongoSetup = require('../config/locomyDB.js');
//require QueryDB mongoose setup
var queryDB = require('../config/queryMongo').queryDB;

function QueryHandler(queryArray, queryInfoArray, apiCode){
	this.queryArray = queryArray;
	this.queryInfoArray = queryInfoArray;
	this.apiCode = apiCode;
	//this.initCode = initCode;
	var _this = this;
	function getCountryCoords(){
		//require randomCoordinates module and input GeoJson file
		var randCoords = require('../app/randomCoordinates');
		if(_this.apiCode == 'DE') return new randCoords(require('../config/geo/GeoJson/germany_wgs1984.json'));
		else if(_this.apiCode == 'US') return new randCoords(require('../config/geo/GeoJson/usa_wgs1984.json'));
		else{logger.log('error', "No GeoJson available in QueryHandler/getCountryCoords method!"); return;}
	}
	this.coords = getCountryCoords();
	function getCredentials(){
		if(_this.apiCode == 'DE') return new Credentials('DE');
		else if(_this.apiCode == 'US') return new Credentials('US');
		else{logger.log('error', "No credentials received!"); return;}
	}
	this.opHelper = new OperationHelper(getCredentials());
}

//fire requests to Amazon Api and store the data received===================================
//save data from Amazon request to MongoDB
QueryHandler.prototype.saveData = function(results){
		var _this = this;
		if(!results.ItemSearchResponse.Items[0].Item) {
			logger.log('warn', 'No result from this query!');
			return;}
		else{
			var itemArray = results.ItemSearchResponse.Items[0].Item;
			async.eachSeries(itemArray, function(item, next){
				var tempCoords = _this.coords.getCoords();
				var newItem = new mongoSetup.products({
						/*ASIN are re-used from Amazon in each locale-zone; to prevent
						duplicates, the countryCode is prefixed to the ASIN-id*/
						id: _this.apiCode+"-"+item.ASIN[0],
						category_id: _this.apiCode+"-"+_this.noBrowseNodeID(item),
						category: _this.noBrowseNodeName(item),
						title: _this.noTitle(item),
						description: _this.noDescription(item),
						image_link: _this.noMediumImage(item),
						//imageSets, 
						imageSet: {
							SwatchImage: _this.noImageSet_XS(item),
							SmallImage: _this.noImageSet_S(item),
							ThumbnailImage: _this.noImageSet_Th(item),
							TinyImage: _this.noImageSet_T(item),
							MediumImage: _this.noImageSet_M(item),
							LargeImage: _this.noImageSet_L(item),
							HiResImage: _this.noImageSet_XL(item)
						},
						//brand = manufacturere field from Amazon
						brand: _this.noManufacturer(item),
						price: _this.noPrice(item),
						x: tempCoords[0],
						y: tempCoords[1]
						});
						newItem.save(function(err){
							if(err == null) logger.log('debug', "Null-Error in mongoose save function (product)");
							else if(err == 11000) logger.log('debug', "Prodcut already in DB!");
							else {logger.log('debug', newItem.title);
							//next();
						}
						});
				var newCat = new mongoSetup.product_categorys({
						category_id: _this.apiCode+"-"+_this.noBrowseNodeID(item),
						name: _this.noBrowseNodeName(item)
						});
						newCat.save(function(err){
							if(err == null) logger.log('debug', "Null-Error in mongoose save function (category)");
							else if(err == 11000) logger.log('debug', "Category already in DB!");
							else {logger.log('debug', 'Category: '+newCat.name);
							;}
						});
					next();
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
	var queryInfo = this.queryInfoArray.pop();
	//get time when function is started
	var hrStart = process.hrtime();
	if(query){
		this.makeRequest(query).then(function(results, err){
			logger.log('info',"Request: "+ JSON.stringify(query));
			/*here is the entry point for the saveData function, which writes to MongoDB
			in my case*/
			self.saveData(results);
			self.changeQryState(queryInfo);
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
			logger.log('debug', "All queries processed!");
			return;
		}	
}
//make a request and resolve the result
QueryHandler.prototype.makeRequest = function(query){
	var _this = this;
	return new Promise(function(resolve, reject){
		_this.opHelper.execute('ItemSearch', query, function(err, results){
			if(err) return reject(err)
			else resolve(results)
			});
	});
}
//change querystate of request in MongoDB after sending request to Amazon========
QueryHandler.prototype.changeQryState = function(queryInfo){
 var query = {query_id: queryInfo.query_id };
 if(this.apiCode == 'DE'){
 queryDB.queries_DE.findOneAndUpdate(query, {$set: {queryState: true}},{new: true},function(err, doc){
		if(err){logger.log('error', err);
			return;}
		else {logger.log('debug', "Query executed, new state saved to MongoDB!");
			return;}
	});
 	}
 else if (this.apiCode == 'US'){
 queryDB.queries_US.findOneAndUpdate(query, {$set: {queryState: true}},{new: true},function(err, doc){
		if(err){logger.log('error', err);
			return;}
		else {logger.log('debug', "Query executed, new state saved to MongoDB!");
			return;}
	});
 	}
 else {logger.log('error', "No apiCode in qryHandler class provided!"); return;}
}

//error handling=================================================================
//handle problems with missing ImageSets

//handle problem with missing ImageSet: SwatchImage
QueryHandler.prototype.noImageSet_XS = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].SwatchImage) return item.ImageSets[0].ImageSet[0].SwatchImage[0].URL[0];
	else return '';
}
//handle problem with missing ImageSet: SmallImage
QueryHandler.prototype.noImageSet_S = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].SmallImage) return item.ImageSets[0].ImageSet[0].SmallImage[0].URL[0];
	else return '';
}
//handle problem with missing ImageSet: ThumbnailImage
QueryHandler.prototype.noImageSet_Th = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].ThumbnailImage) return item.ImageSets[0].ImageSet[0].ThumbnailImage[0].URL[0];
	else return '';
}
//handle problem with missing ImageSet: TinyImage
QueryHandler.prototype.noImageSet_T = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].TinyImage) return item.ImageSets[0].ImageSet[0].TinyImage[0].URL[0];
	else return '';
}
//handle problem with missing ImageSet: MediumImage
QueryHandler.prototype.noImageSet_M = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].MediumImage) return item.ImageSets[0].ImageSet[0].MediumImage[0].URL[0];
	else return '';
}
//handle problem with missing ImageSet: LargeImage
QueryHandler.prototype.noImageSet_L = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].LargeImage) return item.ImageSets[0].ImageSet[0].LargeImage[0].URL[0];
	else return '';
}
//handle problem with missing ImageSet: HiResImage
QueryHandler.prototype.noImageSet_XL = function(item){
	if(item.ImageSets && item.ImageSets[0].ImageSet[0].HiResImage) return item.ImageSets[0].ImageSet[0].HiResImage[0].URL[0];
	else return '';
}
//======================================================================================

//handle versatile problems
//handle problems with category id resp. missing BrowseNode Information
QueryHandler.prototype.noBrowseNodeID = function(item){
	if(item.BrowseNodes) return item.BrowseNodes[0].BrowseNode[0].BrowseNodeId[0];
	else return '';
}
//handle problems with category name resp. missing BrowseNode Information
QueryHandler.prototype.noBrowseNodeName = function(item){
	if(item.BrowseNodes) return item.BrowseNodes[0].BrowseNode[0].Name[0];
	else return '';
}
//handle problems with undefined title
QueryHandler.prototype.noTitle = function(item){
		if(item.ItemAttributes && item.ItemAttributes[0].Title) return item.ItemAttributes[0].Title;
		else return '';
	}
//handle problem with undefined item properties
QueryHandler.prototype.noDescription = function(item){
	if(item.ItemAttributes && item.ItemAttributes[0].Feature) return item.ItemAttributes[0].Feature.join(", ");
	else return '';
	}
//handle problems with undefined prices
QueryHandler.prototype.noPrice = function(item){
		if(item.ItemAttributes[0].ListPrice) return item.ItemAttributes[0].ListPrice[0].Amount[0];
		else return '';
	}
//handle problems for products without a picture
QueryHandler.prototype.noMediumImage = function(item){
		if(item.MediumImage) return item.MediumImage[0].URL[0];
		else return '';
	}
//handle problems for products without manufacturer
QueryHandler.prototype.noManufacturer = function(item){
		if(item.ItemAttributes[0].Manufacturer) return item.ItemAttributes[0].Manufacturer[0];
		else return '';
	}
//export query class
module.exports = QueryHandler;
//export mongoose model
module.exports.mongoSetup = mongoSetup;
