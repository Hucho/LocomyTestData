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
var AmazonApi = require('amz-products');

//set our port =================================================
var port = process.env.PORT || 3000;

//set mongoDB connection
mongoose.connect('mongodb://localhost/locomyDB');

var amazon = new AmazonApi({

	accessKeyId: keys.accessKeyId,
	secretAccessKey: keys.secretAccessKey,
	associateId: keys.associateId_en

});

//genreate request and print to console and store in mongoDB

amazon.getItemsInBrowseNode ({

	  'SearchIndex': 'SportingGoods',
	  'Title': 'Tennis Shoe',
	  'KeyWords': 'Shoe',
	  'ResponseGroup': 'ItemAttributes',
	  'sort': 'relevance'

	}, function(err, results) {
		
		if(err) {console.log(err);}

		else {
				
			for (var numOfitems = 0; numOfitems < results.ItemSearchResponse.Items.Item.length; numOfitems ++) {
			 
			 console.log("Title: " + results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes.Title);
			 
			 var newProduct = new models.products({
			 		title: results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes.Title
			 	});

				 newProduct.save(function(err){

					if (err) {console.log(err);}
					});
				 console.log("mongoDB save: ");
				 console.log(newProduct);


			};

		}
		
	});

//send request to browser

app.get('/test', function(req, res){

amazon.getItemsInBrowseNode ({

	  'SearchIndex': 'SportingGoods',
	  'Title': 'Tennis Shoe',
	  'KeyWords': 'Shoe',
	  'ResponseGroup': 'ItemAttributes',
	  'sort': 'relevance'


	}, function(err, results){
		
		if(err) {console.log(err);}
		else { res.json(results);}
		}
	);

});

//send mongo entries to browser

app.get('/products', function(req,res){

	console.log("Products are requested!");
	models.products.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});


});

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

//require('./app/routes')(app); //configure routes

//start app ===================================================
//startup app at http://localhost: 3000
app.listen(port);

//shoutout to the user
console.log("Nodejs Server for Locomy test data is running on port " + port);

//expose app
exports = module.exports = app;

