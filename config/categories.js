//categories.js
//class to write json template with categories from Amazon for different locales
var fs = require('fs');

function Categories(){
 	/*All main categories from Amazon.
	The following searchindexes were removed in the inital array:
	"Blended", "Marketplace","UnboxVideo"
	The following things have to be considered:
	MusicTracks: no Title allowed,
	All: no title is allowed
	DigitalMusic: One keyword must be set,*/
 	this.cats_US = ['All','Wine','Wireless','ArtsAndCrafts','Miscellaneous','Electronics','Jewelry','MobileApps','Photo','Shoes','KindleStore','Automotive','Pantry','MusicalInstruments','DigitalMusic','GiftCards','FashionBaby','FashionGirls','GourmetFood','HomeGarden','MusicTracks','FashionWomen','VideoGames','FashionMen','Kitchen','Video','Software','Beauty','Grocery','FashionBoys','Industrial','PetSupplies','OfficeProducts','Magazines','Watches','Luggage','OutdoorLiving','Toys','SportingGoods','PCHardware','Movies','Books','Collectibles','Handmade','VHS','MP3Downloads','Fashion','Tools','Baby','Apparel','DVD','Appliances','Music','LawnAndGarden','WirelessAccessories','HealthPersonalCare','Classical'];
 	this.cats_DE = ['All','Beauty','Grocery','Industrial','PetSupplies','OfficeProducts','Electronics','Magazines','Watches','Jewelry','Luggage','MobileApps','Photo','Shoes','KindleStore','Automotive','Pantry','MusicalInstruments','OutdoorLiving','GiftCards','Toys','SportingGoods','PCHardware','Lighting','Outlet','Books','VHS','MP3Downloads','Tools','Baby','HomeGarden','MusicTracks','UnboxVideo','VideoGames','ForeignBooks','Apparel','Marketplace','DVD','HomeImprovement','Appliances','Kitchen','Music','SoftwareVideoGames','Video','Blended','HealthPersonalCare','Classical','Software'];
}

Categories.prototype.getCats = function(locale){
	 var categories = [];
	 if(locale == 'DE') categories = this.cats_DE;
	 else if (locale == 'US') categories = this.cats_US;
	 else console.log("No locale!");

	 var objectArray=[];
		for (var i = 0; i < categories.length; i++){
			if(categories[i] == "MusicTracks"){
			var templateObj = {
					"SearchIndex": categories[i],
					"Title": [""],
					"Keywords": "Rock",
					"MinimumPrice": 500,
					"MaximumPrice": 10000
				}
			objectArray.push(templateObj);
			}
			else if(categories[i] == "All"){
			var templateObj = {
					"SearchIndex": categories[i],
					"Title": [""],
					"Keywords": "Men",
					"MinimumPrice": 500,
					"MaximumPrice": 10000
				}
			objectArray.push(templateObj);
			}
			else if(categories[i] == "DigitalMusic"){
			var templateObj = {
					"SearchIndex": categories[i],
					"Title": [categories[i]],
					"Keywords": "Electro",
					"MinimumPrice": 500,
					"MaximumPrice": 10000
				}
			objectArray.push(templateObj);
			}
			else {
			var templateObj = {
					"SearchIndex": categories[i],
					"Title": [categories[i]],
					"Keywords": "",
					"MinimumPrice": 500,
					"MaximumPrice": 10000
				}
			objectArray.push(templateObj);
			}
		}
	fs.writeFileSync('./config/searchParams_'+locale+'.json', JSON.stringify(objectArray, null, 2),'utf-8');
}
//expose class
 module.exports = Categories;