//QueryHandler: This code takes an array from the qryBuilder and tries to handle
//the request to the Amazon API
//require array from qrybuilder function
var OperationHelper = require('apac').OperationHelper;
var Credentials = require('../config/credentials');
var QueryBuilder = require('../app/qrybuilder');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('../app/models/locomyDB.js')(mongoose, Schema);

//generate new credetials
var cred = new Credentials('EN');

//generate new OperationsHelper for Amazon Product API
var opHelper = new OperationHelper(cred);

//genreate request and print to console and store in mongoDB
var querryArray = [];
querryArray = QueryBuilder();

function saveData(results){
	if(results.ItemSearchResponse.Items[0].TotalResults[0] == '0'){
		console.log("Kein Ergebnis");
	}
	else {
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
			newItem.save(function(err,res){
				if(err) console.log(err)
					console.log(res)
			});
					
		}
	}
}


//batch query all requests from the array and then the result to mongoDB; after do a timeout...
function runQueries(){
	var query = querryArray.pop();
	if(query){
		makeRequest(query).then(function(results){
				console.log(query)
				saveData(results);
			setTimeout(function(){
				runQueries();
			}, 1500);
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
		if(price == undefined) {return '';}
		else {return price[0].Amount[0];}
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

runQueries();

//error handling

//handle problems with undefined title
function noTitle(titleLink){
if(titleLink == undefined){return '';}
else{ return titleLink[0]; }
}

module.exports = runQueries;