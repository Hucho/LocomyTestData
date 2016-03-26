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
	  'Title': 'club',
	  'KeyWords': 'Shoe',
	  'MinimumPrice': '40000',
	  'MaximumPrice': '50000',
	  'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
	  'sort': 'relevance',
	  'locale': 'http://www.amazon.com'

	}, function(err, results) {
		
		if(err) {console.log(err);}

		else {
				
			for (var numOfitems = 0; numOfitems < results.ItemSearchResponse.Items.Item.length; numOfitems ++) {
			 
			 console.log("Title: " + results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes.Title);
				
				//handle problem with undefined item properties
				function undefinedField (field){

					var value = String;

			 			if (field == undefined)
			 				{value ="";}

			 			else if (field.constructor == Array) {value = field.join(',');}

			 			else if (field.constructor == Object) {value = field;}

			 		return value;
			 	}

				//handle problem with BrowseNodes
				function browseNodeHandler(browsenode){

					if(browsenode.constructor == Object){return browsenode.BrowseNodeId}
					else if(browsenode.constructor == Array){return browsenode[0].BrowseNodeId}
				}
				//handle problems with undefined prices
				function undefinedPrices(price){
					if(price.ListPrice == undefined) {return "";}
					else {return price.ListPrice.Amount}
				}


			//map http request to mongoose model	
			 var newProduct = new models.products({

			 		id: results.ItemSearchResponse.Items.Item[numOfitems].ASIN,
			 		category_id: browseNodeHandler (results.ItemSearchResponse.Items.Item[numOfitems].BrowseNodes.BrowseNode),
			 		title: results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes.Title,
			 		description: undefinedField (results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes.Feature),
			 		image_link: undefinedField (results.ItemSearchResponse.Items.Item[numOfitems].MediumImage).URL,
			 		brand: results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes.Manufacturer,
			 		price: undefinedPrices (results.ItemSearchResponse.Items.Item[numOfitems].ItemAttributes)
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
	  'Title': 'club',
	  'KeyWords': 'Shoe',
	  'MinimumPrice': '40000',
	  'MaximumPrice': '50000',
	  'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
	  'sort': 'relevance',
	  'locale': 'http://www.amazon.com'


	}, function(err, results){
		
		if(err) {console.log(err);}
		else { res.json(results);}
		}
	);

});

//send mongo entries to browser with client side

app.get('/products', function(req,res){

	console.log("Products are requested!");
	models.products.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});


});

app.get('/Json', function(req,res){

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

