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
var util = require('util');
var OperationHelper = require('apac').OperationHelper;
var QueryBuilder = require('./app/qrybuilder');

//set our port =================================================
var port = process.env.PORT || 3000;

//set mongoDB connection
mongoose.connect('mongodb://localhost/locomyDB');
mongoose.connection.on('error', console.error.bind('connection error'));
mongoose.connection.once('open', function(){
	console.log("Connection to MongoDB successfully established!")
})

//generate new OperationsHelper for Amazon Product API
var opHelper = new OperationHelper({

    awsId:     keys.accessKeyId,
    awsSecret: keys.secretAccessKey,
    assocId:   keys.associateId_en,
    // xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
    version:   '2013-08-01'
    // your version of using product advertising api, default: 2013-08-01
});

//genreate request and print to console and store in mongoDB
var Query = [];
Query = QueryBuilder();

//send request to browser

app.get('/Error', function(req, res){

	opHelper.execute ('ItemSearch', {

      'SearchIndex': 'Wine',
	  'Title': 'Wine',
	  'KeyWords': 'Red Wine, White Wine, Bordeaux',
	  'MinimumPrice': '9500',
	  'MaximumPrice': '10000',
	  'ResponseGroup': 'ItemAttributes, Images, BrowseNodes',
	  'sort': 'relevance'

		}, function(err, results){
			
			if(err) {console.log(err);}
			else {
				res.json(results);
				console.log("I received "+ results.ItemSearchResponse.Items[0].Item.length + " items from Amazon.com!");
				}
			}
		);

	});

function runQueries (querryArray){

	for(var i = 0; i < querryArray.length; i++){

	newQuery = {
	 	 'SearchIndex': querryArray[i].SearchIndex,
	  	'Title': querryArray[i].Title,
	  	'KeyWords': querryArray[i].KeyWords,
	  	'MinimumPrice': querryArray[i].MinimumPrice,
	 	 'MaximumPrice': querryArray[i].MaximumPrice,
	 	 'ResponseGroup': querryArray[i].ResponseGroup,
	 	 'sort': querryArray[i].sort
		}

	opHelper.execute ('ItemSearch', newQuery

	, function(err, results) {
		
		if(err) {console.log(err);}

		else { console.log();console.log(newQuery);console.log();

			for (var numOfitems = 0; numOfitems < results.ItemSearchResponse.Items[0].Item.length; numOfitems ++) {
			 	//handle problem with undefined item properties
				function undefinedField (field){

					var value = String;

			 			if (field == undefined) {value ="";}

			 			else if (field.constructor == Array) {value = field.join(',');}

			 			else if (field.constructor == Object) {value = field;}

			 		return value;
			 	}
				//handle problems with undefined prices
				function undefinedPrices(price){
					if(price == undefined) {return '';}
					else {return price[0].Amount[0];}
				}
				//handle problems for products without a picture
				function noPictureHandler(picturelink){
					if(picturelink == undefined) {return "";}
					else {return picturelink[0].URL[0];}
				}
				//handle problems for products without manufacturer
				function noManufacHandler (manufLink){
					if(manufLink == undefined){return "";}
					else{return manufLink[0];}
				}
				//handle problems with undefined title
				function noTitle(titleLink){
					if(titleLink == undefined){return '';}
					else{ return titleLink[0]; }
				}

			//map http request to mongoose model	
			 var newProduct = new models.products({
			 		id: results.ItemSearchResponse.Items[0].Item[numOfitems].ASIN[0],
			 		//categroy_id = first order browsenodeId from Amazon
			 		//category_id: undefinedField(results.ItemSearchResponse.Items[0].Item[numOfitems].BrowseNodes[0].BrowseNode[0].BrowseNodeId[0]),
			 		title: noTitle (results.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Title),
			 		description: undefinedField (results.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Feature),
			 		image_link: noPictureHandler (results.ItemSearchResponse.Items[0].Item[numOfitems].MediumImage),
			 		//brand = manufacturere field from Amazon
			 		brand: noManufacHandler (results.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Manufacturer),
			 		price: undefinedPrices (results.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].ListPrice)
			 	});

				 newProduct.save(function(err){
				 	if (err) {console.log(err);}
				 });
				 console.log(newProduct);


			};

		}
		
	});
  }
  console.log("I received "+i*10+" products from Amazon!")
}

runQueries(Query);

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