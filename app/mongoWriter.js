			


			for(var i = 0; i < results.ItemSearchResponse.Items[0].Item.length; i++ ){
				var newItem = new models.products({
					id: results.ItemSearchResponse.Items[0].Item[i].ASIN[0],
					title: noTitle (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Title),
					description: undefinedField (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Feature),
					image_link: noPictureHandler (results.ItemSearchResponse.Items[0].Item[i].MediumImage),
					//brand = manufacturere field from Amazon
					brand: noManufacHandler (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Manufacturer),
					price: undefinedPrices (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice)
					})
					newItem.save(function(err,res){
					if(err) console.log(err)
						console.log(res)
				});
						
			}