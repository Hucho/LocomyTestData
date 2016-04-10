//app/qryHandler.js
//QueryHandler: This code takes an array from the qryBuilder and tries to handle
//the request to the Amazon API
//require array from qrybuilder function
var OperationHelper = require('apac').OperationHelper;
var Credentials = require('../config/credentials');

//requrie function which builds the Querry Array
var QueryBuilder = require('../app/qrybuilder');

//require mongoDB stuff
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('../app/locomyDB.js')(mongoose, Schema);


// //open mongoDB connection and check if it is successfully runnning
mongoose.connect('mongodb://localhost/locomyDB');
mongoose.connection.on('error', console.error.bind('connection error'));
mongoose.connection.once('open', function(){
console.log("Connection to MongoDB successfully established!")
	});

//close all MongoConnections if process shuts down
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

//generate new credetials for connecting the Amazon API
var cred = new Credentials('EN');

//generate new OperationsHelper for Amazon Product API
var opHelper = new OperationHelper(cred);

//genreate Array of Amazon API requests

var querryArray = [];
querryArray = QueryBuilder();

function saveData(results){
		if(results.ItemSearchResponse.Items[0].TotalResults[0] == '0') console.log("Kein Ergebnis");
		else {
			//loop throgh request result for each item	
			for(var i = 0; i < results.ItemSearchResponse.Items[0].Item.length; i++ ){
				var newItem = new models.products({
					id: results.ItemSearchResponse.Items[0].Item[i].ASIN[0],
					title: noTitle (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Title),
					description: undefinedField (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Feature),
					image_link: noPictureHandler (results.ItemSearchResponse.Items[0].Item[i].MediumImage),
					//brand = manufacturere field from Amazon
					brand: noManufacHandler (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Manufacturer),
					price: undefinedPrices (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice)
					})
					//check if item already exists
					
					//save new item if err because it does not exist
					newItem.save(function(err,res){
					if(err) console.log(err); console.log(res)})
										
			}
			
		}
	}


//batch query all requests from the array and then the result to mongoDB; after do a timeout...
function runQueries(){
	var query = querryArray.pop();

	if(query){
		makeRequest(query).then(function(results){
				console.log(query)

				/*here is the entry point for the saveData function, which writes to MongoDB
				in my case*/

				saveData(results);
			setTimeout(function(){
				runQueries();
			}, 1001);
			;
			})
		}	
	}

//make a request and resolve the result
function makeRequest(query){
	return new Promise(function(resolve, reject){
		opHelper.execute('ItemSearch', query, function(err, results){
			if(err) return reject(err)
			else {resolve(results)}
			})
	})
	}

//error handling

//handle problems with undefined title
function noTitle(titleLink){
	if(titleLink == undefined){return '';}
	else{ return titleLink[0]; }
	}

//handle problem with undefined item properties
function undefinedField (field){
		var value = String;
	 			if (field == undefined) {value ="";}
		 			else if (field.constructor == Array) {value = field.join(',');}
		 			else if (field.constructor == Object) {value = field;}
			 		return value;
				 	}

//handle problems with undefined prices
function undefinedPrices(price){
		if(price == undefined) {return ''}
		else {return price[0].Amount[0]}
		}

//handle problems for products without a picture
function noPictureHandler(picturelink){
		if(picturelink == undefined) {return "";}
		else {return picturelink[0].URL[0];}s
		}
		
//handle problems for products without manufacturer
function noManufacHandler (manufLink){
		if(manufLink == undefined){return "";}
		else{return manufLink[0];}
		}

module.exports = runQueries;
module.exports.models = models;
