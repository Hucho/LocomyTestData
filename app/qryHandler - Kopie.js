//QueryHandler: This code takes an array from the qryBuilder and tries to handle
//the request to the Amazon API
"use strict";
//require array from qrybuilder function
var OperationHelper = require('apac').OperationHelper;
var Credentials = require('../config/credentials');
var QueryBuilder = require('../app/qrybuilder');

//generate new credetials
var cred = new Credentials('EN');

//generate new OperationsHelper for Amazon Product API
var opHelper = new OperationHelper(cred);

//genreate request and print to console and store in mongoDB
var querryArray = [];
querryArray = QueryBuilder();

//This function...
function runQueries(querryArray){

	let promises = querryArray.map(query => makeRequest(query))
		return Promise.all(promises);
}

//make a request, mutate parsed Products then resolve
function makeRequest(query){
	return new Promise(function(resolve, reject){
		opHelper.execute('ItemSearch', query, function(err, result){
			if(err) return reject(err)
			resolve(result)
			})
	})
}

runQueries(querryArray).then((result) => {
	console.log(result);
	}).catch((err) =>{
		console.log(err);
	})


module.exports = runQueries;