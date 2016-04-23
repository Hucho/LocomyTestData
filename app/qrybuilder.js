//app/qrybuilder.js
//constructor
function queryArray(json){
	this.json = json;
}
//init qry template with default values
queryArray.prototype.qryInit = function() {
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
 queryArray.prototype.qryTempArray = function (){
	var template = this.qryInit();
	var qryTempArray1 = [];
	for(var i = 0; i < this.json.length; i++){
		qryTempArray1.push({
		'SearchIndex': this.json[i].SearchIndex,
		'Title': this.json[i].Title,
		'Keywords': this.json[i].Keywords,
		'MinimumPrice': this.json[i].MinimumPrice,
		'MaximumPrice': this.json[i].MaximumPrice,
		'ResponseGroup': template.ResponseGroup,
		'sort': template.sort
		});
	}
	return qryTempArray1;
}
//helper function for priceArray1
 queryArray.prototype.minGen = function(i){
	var Array2 = (this.qryTempArray(this.json));
	var miniArray =[];
	//set number in Euro/Dollar cents to set the increment between two queries
	for(n = Array2[i].MinimumPrice; n < Array2[i].MaximumPrice; n+=250){
			miniArray.push(n);
		}
	return miniArray;
	}
//function vor calculating the price range as query multiplyer
 queryArray.prototype.priceArray = function(){
	var Array1 = (this.qryTempArray(this.json));
	var minimumArray = [];
	for(var i = 0; i < Array1.length; i++){
			minimumArray.push({
				'index': i,
				'pricesMin': this.minGen(i)
			});	
	}
	return minimumArray;
}
//function for finally building all the queries
 queryArray.prototype.qryBuilder = function(){
	var qryTempArray1 = [];
	qryTempArray1 = this.qryTempArray(this.json);
	var priceArray1 = [];
	priceArray1 = this.priceArray();
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
queryArray.prototype.multiReqByTitle = function(){
	var sourceArray = this.qryBuilder();
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
module.exports = queryArray;