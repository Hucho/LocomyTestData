//app/qrybuilder.js
//require json template for queryBuilder
var json = require('../config/searchParams_EN.json');
//init qry template with default values
function qryInit () {
	var qryTemplate = {
	'SearchIndex': '',
	'Title': '',
	'Keywords': '',
	'MinimumPrice': '',
	'MaximumPrice': '',
	'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
	'sort': 'relevance'
	}
	return qryTemplate;
}
//generate array of request templates
 function qryTempArray  (json){
	var template = qryInit();
	var qryTempArray1 = [];
	for(var i = 0; i < json.length; i++){
		qryTempArray1.push({
		'SearchIndex': json[i].SearchIndex,
		'Title': json[i].Title,
		'Keywords': json[i].Keywords,
		'MinimumPrice': json[i].MinimumPrice,
		'MaximumPrice': json[i].MaximumPrice,
		'ResponseGroup': template.ResponseGroup,
		'sort': template.sort
		});
	}
	return qryTempArray1;
}
//helper function for priceArray1
function minGen (i){
	var Array2 = (qryTempArray(json));
	var miniArray =[];
	//set number in Euro/Dollar cents to set the increment between two queries
	for(n = Array2[i].MinimumPrice; n < Array2[i].MaximumPrice; n+=250){
			miniArray.push(n);
		}
	return miniArray;
	}
//function vor calculating the price range as query multiplyer
function priceArray (){
	var Array1 = (qryTempArray(json));
	var minimumArray = [];
	for(var i = 0; i < Array1.length; i++){
			minimumArray.push({
				'index': i,
				'pricesMin': minGen(i)
			});	
	}
	return minimumArray;
}
//function for finally building all the queries; this function is exposed
function qryBuilder (){
	var qryTempArray1 = [];
	qryTempArray1 = qryTempArray(json);
	var priceArray1 = [];
	priceArray1 = priceArray();
	var builtQryArray = [];
	for(var i = 0; i < qryTempArray1.length; i++){
		for(var z = 0; z < priceArray1[i].pricesMin.length; z++){
				builtQryArray.push({
					'SearchIndex': qryTempArray1[i].SearchIndex,
					'Title': qryTempArray1[i].Title,
					'MinimumPrice': JSON.stringify(priceArray1[i].pricesMin[z]),
					//set number in Euro/Dollar cents to set the increment between two queries
					'MaximumPrice': JSON.stringify(priceArray1[i].pricesMin[z]+250),
					'Keywords': qryTempArray1[i].Keywords,
					'ResponseGroup': qryTempArray1[i].ResponseGroup,
					'sort': qryTempArray1[i].sort
				});
		}
	}
	return builtQryArray;
}
//function to multiply the queries based on the title array
function multiReqByTitle(){
	var sourceArray = qryBuilder();
	var superArray = [];
	sourceArray.map(function(query){
		query.Title.forEach(function(element){
			superArray.push({
				'SearchIndex': query.SearchIndex,
				'Title': element,
				'MinimumPrice': query.MinimumPrice,
				//set number in Euro/Dollar cents to set the increment between two queries
				'MaximumPrice': query.MaximumPrice,
				'Keywords': query.Keywords,
				'ResponseGroup': query.ResponseGroup,
				'sort': query.sort
				});
		});
	});
	console.log(superArray.length + " queries have been built!");
	return superArray;
}
//expose module
module.exports = multiReqByTitle;