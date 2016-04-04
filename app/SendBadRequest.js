/*this module is made to send a bad request to the Amazon server
in oder to get the categories list*/
//require apac module and credentials
var OperationHelper = require('apac').OperationHelper;
var Credentials = require('../config/credentials');
var app = require('../server.js');


function SendBadRequest(code){

this.code = code;

}

SendBadRequest.prototype.Query = function(){

//generate new credetials for connecting the Amazon API
var cred = new Credentials(this.code);

//generate new OperationsHelper for Amazon Product API
var opHelper = new OperationHelper(cred);

app.get('/BadRequest', function(req, res){

opHelper.execute('ItemSearch', {

 	  'SearchIndex': 'SportingGoods',
	  'Title': 'Ball',
	  'KeyWords': 'Football',
	  'ResponseGroup': 'ItemAttributes',
	  'sort': 'relevance'

		}, function(err, items){

			if(err)console.log(err)

			else {console.log(items);
				res.json(items);}

		})
	}
)
}

module.exports = SendBadRequest;