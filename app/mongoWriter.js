function modelProduct (res){
			for (var numOfitems = 0; numOfitems < res.ItemSearchResponse.Items[0].Item.length; numOfitems ++) {
				//declare new array for storing the productObjects
				var productsArray = [];
			 	//handle problem with undefined item properties
				function undefinedField (field){
					var value = String;
			 			if (field == undefined) {value ="";}
			 			else if (field.constructor == Array) {value = field.join(',');}
			 			else if (field.constructor == Object) {value = field;}
			 		return value;}
				//handle problems with undefined prices
				function undefinedPrices(price){
					if(price == undefined) {return '';}
					else {return price[0].Amount[0];}}
				//handle problems for products without a picture
				function noPictureHandler(picturelink){
					if(picturelink == undefined) {return "";}
					else {return picturelink[0].URL[0];}}
				//handle problems for products without manufacturer
				function noManufacHandler (manufLink){
					if(manufLink == undefined){return "";}
					else{return manufLink[0];}}
				//handle problems with undefined title
				function noTitle(titleLink){
					if(titleLink == undefined){return '';}
					else{ return titleLink[0]; }}
			//map http request to mongoose model	
			 		var newProduct = new models.products({
				 		id: res.ItemSearchResponse.Items[0].Item[numOfitems].ASIN[0],
				 		//categroy_id = first order browsenodeId from Amazon
				 		category_id: undefinedField(res.ItemSearchResponse.Items[0].Item[numOfitems].BrowseNodes[0].BrowseNode[0].BrowseNodeId[0]),
				 		title: noTitle (res.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Title),
				 		description: undefinedField (res.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Feature),
				 		image_link: noPictureHandler (res.ItemSearchResponse.Items[0].Item[numOfitems].MediumImage),
				 		//brand = manufacturere field from Amazon
				 		brand: noManufacHandler (res.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].Manufacturer),
				 		price: undefinedPrices (res.ItemSearchResponse.Items[0].Item[numOfitems].ItemAttributes[0].ListPrice)
			 			});
			 	productsArray.push(newProduct);
				}
	return productsArray;			
}