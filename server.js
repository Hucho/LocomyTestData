//server.js

//modules ======================================================
var express = require ("express");
var app = express();
var bodyParser = require("body-Parser");
var methodOverride = require("method-override");
var amazon = require('amazon-product-api');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./app/models/locomyDB.js')(mongoose, Schema);

//create Amazon client
var client = amazon.createClient({

	aws: "aws ID",
	awsSecret: "aws Secret",
	awsTag: 'aws Tag'

});

//set our port =================================================
var port = process.env.PORT || 3000;

//set mongoDB connection
mongoose.connect('mongodb://localhost/locomyDB');


//enter new rating
var rating = new models.product_ratings({

		id: 1,
		product_id: 5,
		rate: 3,
		description: 'A great product!'

});

rating.save(function(err){

	if (err) {console.log(err);}
	else {console.log(rating);}

});

//entner new user
 var newUser = new models.users ({

 	id: 007,
	username: '00-Agent',
	password: '007',
	name: 'James Bond',
	age: 45,
	sex: 0,
	mobile: '+41 000 007',
	address: 'Downingstreet No. 10, London',
	is_provider: 0,
	is_admin_provider: 0,
	jid: 001,
	user_location: [{x: 111, y: 222}]

 });

newUser.save(function(err){

	if (err) {console.log(err);}
	else {console.log(newUser);}

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
require('./app/routes')(app); //configure routes

//start app ===================================================
//startup app at http://localhost: 3000
app.listen(port);

//shoutout to the user
console.log("Nodejs Server for Locomy test data is running on port " + port);

//expose app
exports = module.exports = app;

