//server.js

//modules ======================================================
var express = require ("express");
var app = express();
var bodyParser = require("body-Parser");
var methodOverride = require("method-override");
var util = require('util');
var runQueries = require('./app/qryHandler');

//rund Queries against Amazon API and save results
//to MongoDB
runQueries();

function resToBrowser(){

	app.get('/', function(req,res){

		console.log("Products are requested!");
		/*model may not be defined due to re-compiling problem
		with runQueries function*/
		models.products.find(function(err, docs){
			console.log(docs);
			res.json(docs);
		});

		});
}

resToBrowser();

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

//routes ======================================================

//require('./app/routes')(app); //configure routes

//set our port =================================================
var port = process.env.PORT || 3000;
//start app ===================================================
//startup app at http://localhost: 3000
app.listen(port);

//shoutout to the user
console.log("Nodejs Server for Locomy test data is running on port " + port);

//expose app
exports = module.exports = app;