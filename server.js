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

/*This starts the complete app===========================================================
The configuration works as follows:
First paramter of task object: 0 = Continue querying without building new
queries; 1 = delete all existing queries for DE and US API and generate
new queries for both APIs.
Second parameter of task obejct: 0 = Continue querying without deleting any product items
or categrories; 1 = delete all product items and categories before starting fetch data
from Amazon*/
var Taskmanager = require('./app/taskmanager');
var task = new Taskmanager(1,1);
//task.CreateQueries('DE');//generate new Queries in case
//task.init();//delete all products before start querying session in case
task.RunQueries('DE');//start fetching products




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
	var cred1 = new Credentials('DE');
	var opHelper1 = new OperationHelper(cred1);
	app.get('/BadRequest', function(req, res){
		opHelper1.execute('ItemSearch', {
		 	  'SearchIndex': 'Beleuchtung',
			  'Title': 'LED',
			  'MinimumPrice': '10000',
			  'MaximumPrice': '100000',
			  'Keywords': '',
			  'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
			  'sort': 'relevance'
				}).then((response) => {
					res.json(response);
				}).catch((err) => {
					console.log(err);
						})	
		})}
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