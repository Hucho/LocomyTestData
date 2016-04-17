//this module generates random coordinates for the MongoDB
var Terraformer = require('terraformer');
var usa_geojson = require('../config/geo/GeoJson/usa_wgs1984.json');

//construtctor
function RandomCoords(geojson){
	this.geojson = geojson;
}
//method for generating random coordinates
RandomCoords.prototype.getCoords = function(){
	//create an Terraformer Polygon Object based on GeoJson input file
	var polygon = new Terraformer.Polygon({
		"type": "Polygon",
		"coordinates": this.geojson.geometries[0].coordinates
	});
	//calculate bounding box of input file
	var bbox = polygon.bbox();
	//calculate a random longitude inside the bounding box
	var newLong =  bbox[0] + Math.random()*(bbox[2] - bbox[0]);
	//calcualte a random latitude inside the bounding box
	var newLat = bbox[1] + Math.random()*(bbox[3] - bbox[1]);
	//generate a Terraformer Point object from the new random coordinates
	var point = new Terraformer.Point({
		type: "Point",
		coordinates: [newLong, newLat]
	});
	//test, if the new random coordinate is inside of the input polygon
	if(point.within(polygon)) return ([newLong, newLat]);
	//if not, recall function
	else return this.getCoords();
}
//export class
module.exports = RandomCoords;