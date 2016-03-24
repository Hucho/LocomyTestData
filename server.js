//server.js

//modules ======================================================
var express = require ("express");
var app = express();
var bodyParser = require("body-Parser");
var methodOverride = require("method-override");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./app/models/locomyDB.js')(mongoose, Schema);
var keys = require ('./config/credentials.js')

//set our port =================================================
var port = process.env.PORT || 3000;

//set mongoDB connection
mongoose.connect('mongodb://localhost/locomyDB');

//require util and apac
var util = require('util'),
    OperationHelper = require('apac').OperationHelper;

//generate Operationhelper with ids
var opHelper = new OperationHelper({
  awsId: keys.accessKeyId,
  awsSecret: keys.secretAccessKey,
  assocId: keys.associateId_en
});

//genreate request and print to console and store in mongoDB

	opHelper.execute('ItemSearch', {
	  'SearchIndex': 'SportingGoods',
	  'Title': 'Soccer Ball',
	  'KeyWords': 'Soccer',
	  'ResponseGroup': 'ItemAttributes',
	  'sort': 'relevance'

	}, function(err, results) {
		
		if(err) {console.log(err);}

		else {

			console.log(typeof(results));
			
			for (var numOfitems = 0; numOfitems < results.ItemSearchResponse.Items[0].Item.length; numOfitems ++)	{
			 
			 console.log(results.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Title);
			 var newProduct = new models.products({

			 		title: results.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Title
			 });

			 newProduct.save(function(err){

			if (err) {console.log(err);}
			else {console.log(newProduct);}

			});


			}

		}
		
	});

//send request to browser

//enter new rating
// var rating = new models.product_ratings({

// 		id: 1,
// 		product_id: 5,
// 		rate: 3,
// 		description: 'A great product!'

// });

// rating.save(function(err){

// 	if (err) {console.log(err);}
// 	else {console.log(rating);}

// });

//entner new user
//  var newUser = new models.users ({

//  	id: 007,
// 	username: '00-Agent',
// 	password: '007',
// 	name: 'James Bond',
// 	age: 45,
// 	sex: 0,
// 	mobile: '+41 000 007',
// 	address: 'Downingstreet No. 10, London',
// 	is_provider: 0,
// 	is_admin_provider: 0,
// 	jid: 001,
// 	user_location: [{x: 111, y: 222}]

//  });

// newUser.save(function(err){

// 	if (err) {console.log(err);}
// 	else {console.log(newUser);}

// });


//get all data/stuff of the body (POST) parameters
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

require('./app/routes')(app); //configure routes

//start app ===================================================
//startup app at http://localhost: 3000
app.listen(port);

//shoutout to the user
console.log("Nodejs Server for Locomy test data is running on port " + port);

//expose app
exports = module.exports = app;

