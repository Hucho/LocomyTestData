//categories_EN.js
//function to write json template with all english categories from Amazon
 function returnCats(){

var fs = require('fs');

/*all main categories from Amazon. "Blended" was removed
as Title and MinimumPrice is not allowed for the category as a parameter;
marketplace also removed, no Title for MusicTracks allowed, for the
searchIndex "DigitalMusic", one keyword must be set, when searchIndex
is all, no title is allowed*/
 var categories = ['All','Wine','Wireless','ArtsAndCrafts','Miscellaneous','Electronics','Jewelry','MobileApps','Photo','Shoes','KindleStore','Automotive','Pantry','MusicalInstruments','DigitalMusic','GiftCards','FashionBaby','FashionGirls','GourmetFood','HomeGarden','MusicTracks','UnboxVideo','FashionWomen','VideoGames','FashionMen','Kitchen','Video','Software','Beauty','Grocery','FashionBoys','Industrial','PetSupplies','OfficeProducts','Magazines','Watches','Luggage','OutdoorLiving','Toys','SportingGoods','PCHardware','Movies','Books','Collectibles','Handmade','VHS','MP3Downloads','Fashion','Tools','Baby','Apparel','DVD','Appliances','Music','LawnAndGarden','WirelessAccessories','HealthPersonalCare','Classical'];
 var objectArray=[];

	for (var i = 0; i < categories.length; i++){
		var templateObj = {

				"SearchIndex": categories[i],
				"Title": categories[i],
				"Keywords": '',
				"MinimumPrice": 500,
				"MaximumPrice": 10000

		}
		objectArray.push(templateObj);
	}
fs.writeFileSync('./config/searchParams_EN.json', JSON.stringify(objectArray, null, 2),'utf-8');
}

 module.exports = returnCats;