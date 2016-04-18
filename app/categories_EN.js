//categories_EN.js
//function to write json template with all english categories from Amazon
 function returnCats(){
	var fs = require('fs');
	/*All main categories from Amazon.
	The following searchindexes were removed in the inital array:
	"Blended", "Marketplace","UnboxVideo"
	The following things have to be considered:
	MusicTracks: no Title allowed,
	All: no title is allowed
	DigitalMusic: One keyword must be set,*/
	 var categories = ['All','Wine','Wireless','ArtsAndCrafts','Miscellaneous','Electronics','Jewelry','MobileApps','Photo','Shoes','KindleStore','Automotive','Pantry','MusicalInstruments','DigitalMusic','GiftCards','FashionBaby','FashionGirls','GourmetFood','HomeGarden','MusicTracks','FashionWomen','VideoGames','FashionMen','Kitchen','Video','Software','Beauty','Grocery','FashionBoys','Industrial','PetSupplies','OfficeProducts','Magazines','Watches','Luggage','OutdoorLiving','Toys','SportingGoods','PCHardware','Movies','Books','Collectibles','Handmade','VHS','MP3Downloads','Fashion','Tools','Baby','Apparel','DVD','Appliances','Music','LawnAndGarden','WirelessAccessories','HealthPersonalCare','Classical'];
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
	fs.writeFileSync('./config/searchParams_EN.json', JSON.stringify(objectArray, null, 2),'utf-8');
}
//expose module
 module.exports = returnCats;