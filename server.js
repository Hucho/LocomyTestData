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

//requrire the query factory class
var queryFactory = require('./app/qrybuilder');
//create a new instance of the queryFactory class
var QueryBuilder = new queryFactory(require('./config/searchParams_EN.json'));
//require QueryHandler class
var QueryHandler = require('./app/qryHandler');
//instatiate new QueryHandler object and inject querry array
var queryRun1 = new QueryHandler(QueryBuilder.multiReqByTitle());
queryRun1.runQueries();

//TEST
// var queryDB = require('./config/queryDB');
// var mongoquery = require('./config/queryMongo');
// var query = {'SearchIndex': 'All'};
// var QueryMongo = new mongoquery(query);
// var queryArray = QueryMongo.getQueries(array);

// function array (doc){
// 	queryArray = doc;
// 	console.log(queryArray[0]);
// }


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
		 	  'SearchIndex': 'MusicTracks',
			  'Title': '',
			  'MinimumPrice': '26000',
			  'MaximumPrice': '26250',
			  'Keywords': 'Rock',
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