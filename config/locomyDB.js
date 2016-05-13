//config/locomyDB.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
function mongoSetup (mongoose, Schema){
//connect to database
var db = mongoose.createConnection('mongodb://localhost/locomyDB');
db.on('error', console.error);
db.once('open', function(){
	console.log("Connection to LocomyDB established!");
});
//define locomyDB model
var product = new Schema ({
	// id changed from Number to StringS
	id: String,
	//category_id changed to String
	category_id: String,
	//category added
	category: String,
	title: String,
	description: String,
	creation_date: {type: Date, default: Date.now},
	//timestamp is not modeled correctly
	creation_time: {type: Date, default: Date.now},
	modification_date: {type: Date, default: Date.now},
	//timestamp is not modeled correctly
	modification_time: {type: Date, default: Date.now},
	is_visible: Boolean,
	in_stock: Number,
	identifier_exists: Boolean,
	//"-" replaced with "_"
	is_bundle: Boolean,
	link: String,
	mobile_link: String,
	//now the medium image from amz is saved
	image_link: String,
	//imageSet
	imageSet: {
		SwatchImage: String,
		SmallImage: String,
		ThumbnailImage: String,
		TinyImage: String,
		MediumImage: String,
		LargeImage: String,
		HiResImage: String
		},
	additional_image_links: String,
	content_language: String,
	target_country: String,
	channel: String,
	expiration_date: Date,
	adult: Boolean,
	age_group: String,
	availability: String,
	availability_date: Date,
	brand: String,
	color: String,
	condition: String,
	gender: String,
	matrial: String,
	pattern: String,
	price: Number,
	price_currency: String,
	is_sale: Boolean,
	sale_price: Number,
	sizes: String,
	size_type: String,
	size_system: String,
	online_only: Boolean,
	locomy_point: Number,
	//x and y added; original db scheme altered
	x: Number,
	y: Number}, {collection: 'product'});

var product_rating = new Schema ({
	id: Number,
	product_id: Number,
	rate: Number,
	description: String}, {collection:'product_rating'});

var product_shipping = new Schema ({
	id: Number,
	product_id: Number,
	shipping_price: Number,
	shipping_currency: String,
	shipping_weight: Number,
	shipping_weight_unit: String,
	shipping_length: Number,
	shipping_length_unit: String,
	shipping_width: Number,
	shipping_width_unit: String,
	shipping_height: Number,
	shipping_height_unit: String,
	shipping_label: [{shipping_area_id: Number}],
	//shipping_areas definition may be changed
	shipping_areas: [{area: String, zip_code: Number}] }, {collection: 'product_shipping'});

var product_category = new Schema ({
	id: Number,
	//changed category_id to String
	category_id: String,
	name: String,
	desciption: String }, {collection: 'product_category'});

var product_custom_attribute = new Schema ({
	id: Number,
	name: String,
	type: String,
	unit: String,
	value: String,
	product_id: Number }, {collection: 'product_custom_attributes'});

var product_activity_log = new Schema ({
	id: Number,
	product_id: Number,
	key: String,
	value: String,
	date: Date,
	//timestamp is not modeled correctly
	time: {type: Date, default: Date.now} }, {collection: 'product_activity_log'});

var product_shop = new Schema ({
	id: Number,
	product_id: Number,
	shop_id: Number }, {collection: 'product_shop'});

var shop = new Schema ({
	id: Number,
	name: String,
	phone: String,
	fax: String,
	email: String,
	website: String,
	address: String,
	x: Number,
	y: Number,
	geom: [{x: Number, y: Number}] }, {collection: 'shop'});

var shop_rating = new Schema ({
	id: Number,
	shop_id: Number,
	rate: Number,
	description: String }, {collection: 'shop_rating'});

var product_review = new Schema ({
	id: Number,
	user_id: Number,
	product_id: Number,
	comment: String }, {collection: 'product_review'});

var product_user = new Schema ({
	id: Number,
	product_id: Number,
	user_id: Number }, {collection: 'product_user'});

var user = new Schema ({
	id: Number,
	username: String,
	password: String,
	name: String,
	age: Number,
	sex: Boolean,
	mobile: String,
	address: String,
	is_provider: Boolean,
	is_admin_provider: Boolean,
	jid: String,
	user_location: [{x: Number, y: Number}] }, {collection: 'user'});

var messenger_activity_log = new Schema ({
	id: Number,
	sender_user_id: Number,
	sender_jid: String,
	receiver_user_id: Number,
	receiver_jid: String,
	sid: String,
	rid: String,
	//timestamp may not be modeled correctly
	creation_time: {type: Date, default: Date.now},
	termination_time: {type: Date, default: Date.now} }, {collection: 'messenger_activity_log'});

var user_actvity_log = new Schema ({
	id: Number,
	sender_user_id: Number,
	sender_jid: String,
	receiver_user_id: Number,
	receiver_jid: String,
	sid: String,
	rid: String,
	//timestamp may not be modeled correctly
	creation_time: {type: Date, default: Date.now},
	termination_time: {type: Date, default: Date.now} }, {collection: 'user_actvity_log'});

var user_lp = new Schema ({
	id: Number,
	user_id: Number,
	balance: Number,
	expiration_date: Date,
	shop_id: Number,
	product_id: Number
	}, {collection: 'user_lp'});

var user_config = new Schema ({
	id: Number,
	user_id: Number,
	key: String,
	value: String,
	description: String
	}, {collection: 'user_config'});

var spatial_ref_sy = new Schema ({
	srid: Number,
	auth_name: String,
	auth_srid: Number,
	srtext: String,
	proj4text: String
	}, {collection: 'spatial_ref_sys'});

var system_setting = new Schema ({
	id: Number,
	key: String,
	value: String,
	description: String
	}, {collection: 'system_setting'});

var models = {
	products: db.model('products', product),
	product_ratings: db.model('product_ratings', product_rating),
	product_shippings: db.model('product_shippings', product_shipping),
	product_categorys: db.model('product_categorys', product_category),
	product_custom_attributes: db.model('product_custom_attributes', product_custom_attribute),
	product_activity_logs: db.model('product_activity_logs', product_activity_log),
	product_shops: db.model('product_shops', product_shop),
	shops: db.model('shops', shop),
	shop_ratings: db.model('shop_ratings', shop_rating),
	product_reviews: db.model('product_reviews', product_review),
	product_users: db.model('product_users', product_user),
	users: db.model('users', user),
	messenger_activity_logs: db.model('messenger_activity_logs', messenger_activity_log),
	user_actvity_logs: db.model('user_actvity_logs', user_actvity_log),
	user_lps: db.model('user_lps', user_lp),
	user_configs: db.model('user_configs', user_config),
	spatial_ref_sys: db.model('spatial_ref_sys', spatial_ref_sy),
	system_settings: db.model('system_settings', system_setting)
	};
return models;
}
module.exports = mongoSetup(mongoose, Schema);
