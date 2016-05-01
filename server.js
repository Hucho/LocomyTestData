//server.js
//modules ==============================================================================
var express = require ("express");
var app = express();
var async = require('async');
var bodyParser = require("body-Parser");
var methodOverride = require("method-override");
var util = require('util');
var logger = require('./config/logger');
/*require locomyDB model from qryHandler module,
because it can only be once compiled*/
var mongoSetup = require('./app/qryHandler').mongoSetup;
/*run Queries against Amazon API and save results to MongoDB===========================*/
//require QueryHandler class
var QueryHandler = require('./app/qryHandler');
//require mongo query class to get queries from MongoDB
var mongoquery = require('./config/queryMongo');
//instantiate queryMongo class 
var QueryMongo = new mongoquery;
//write queries to MongoDB
//QueryMongo.queriesToMongoDB();

function array (doc){
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
	var queryRun1 = new QueryHandler(queryArray, queryInfoArray);
	queryRun1.runQueries();
}
//START APP AND RUN ALL QUERIES
QueryMongo.getQueries(array);

/*function which brings the results from Amazon
in the MongoDB to the Browser to confirm that data
has been written*/
function resToClientSide(){
	app.get('/products', function(req,res){
		console.log("Products are requested!");
		mongoSetup.products.find(function(err, docs){
			if(err) console.log(err);
			else{console.log(docs);
				res.json(docs);}
		});
	});}
resToClientSide();
/*generate bad request for Amazon server
to retrieve categories list*/
function badRequest(){
	var OperationHelper = require('apac').OperationHelper;
	var Credentials = require('./config/credentials');
	var cred = new Credentials('EN');
	var opHelper = new OperationHelper(cred);
	app.get('/BadRequest', function(req, res){
		opHelper.execute('ItemSearch', {
		 	  'SearchIndex': 'HealthPersonalCare',
			  'Title': 'Hair',
			  'MinimumPrice': '3250',
			  'MaximumPrice': '3500',
			  'Keywords': '',
			  'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
			  'sort': 'relevance'
				}).then((response) => {
					res.json(response);
				}).catch((err) => {
					console.log(err);
						})	
		})
}
badRequest();
//parse application/json
app.use(bodyParser.json());
//parse application/vnd.api+json as json
app.use(bodyParser.json({type:"application/vnd.api+json"}));
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//override with the X-HTTP-Method-Override header in the request simulating DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));
//set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
//set our port =================================================
var port = process.env.PORT || 3000;
//start app ===================================================
//startup app at http://localhost: 3000
app.listen(port);
//shoutout to the user
console.log("Nodejs Server for Locomy test data is running on port " + port);
//expose app
exports = module.exports = app;