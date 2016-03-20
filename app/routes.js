// app/routes.js

//grab the Products model

var Products = require('./models/locomyDB');

	module.exports = function(app){
		//server routes =====================================
		//handle things like api calls
		//authentication routes
		
		//sample api routeEvents
		
		app.get('/product', function(req,res){
			
			//user mongoose to get all products in the database
			product.find(function(err,products){
				//if there is an error retrieving, send the error.
				//nothing after res.send(err) will execute
				
				if(err)
					res.send(err);
				
				res.json(products);//return all products in Json format
			});
			
			
		});
		// route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });
		
	};