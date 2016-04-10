//server.js

//modules ======================================================
var express = require ("express");
var app = express();
var bodyParser = require("body-Parser");
var methodOverride = require("method-override");
var util = require('util');
var runQueries = require('./app/qryHandler');
//require mongo stuff
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*require locomyDB model from qryHandler module,
because it can only be once compiled*/
var models = require('./app/qryHandler').models;

/*rund Queries against Amazon API and save results
to MongoDB*/
runQueries();

/*function which brings the results from Amazon in the MongoDB to the Browser
to confirm that data has been written*/
function resToClientSide(){
	//set mongoDB connection
	mongoose.connect('mongodb://localhost/locomyDB');
	mongoose.connection.on('error', console.error.bind('connection error'));
	mongoose.connection.once('open', function(){
		console.log("Connection to MongoDB successfully established!")
	})
	app.get('/products', function(req,res){
		console.log("Products are requested!");
		models.products.findOne(function(err, docs){
			if(err) console.log(err);
			else{console.log(docs);
				res.json(docs);}
		});

	});}

//resToClientSide();

//close all MongoConnections if process shuts down
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

//generate bad request for Amazon server to retrieve categories list

function badRequest(){

var OperationHelper = require('apac').OperationHelper;
var Credentials = require('./config/credentials');
var cred = new Credentials('EN');
var opHelper = new OperationHelper(cred);

app.get('/BadRequest', function(req, res){

opHelper.execute('ItemSearch', {

 	  'SearchIndex': 'All',
	  'Title': '',
	  'MinimumPrice': '5500',
	  'MaximumPrice': '10500',
	  'Keywords': 'Bycicle',
	  'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
	  'sort': 'relevance'

		}, function(err, items){

			if(err)console.log(err)

			else {console.log(items);
				res.json(items);}
				
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