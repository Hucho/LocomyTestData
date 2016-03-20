// app/models/locomyDB.js
//grab the mongoose module
var mongoose = require('mongoose');

//define locomy model
//module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('product', {

	id: Number,
	category_id:Number,
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
	is-bundle: Boolean,
	link: String,
	mobile_link: String,
	image_link: String,
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
	locomy_point: Number},'product');

module.exports = mongoose.model('product_rating', {

	id: Number,
	product_id: Number,
	rate: Number,
	description: String},'product_rating');

module.exports = mongoose.model('product_shipping', {

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
	shipping_label: String,
	shipping_areas: [{area: String, zip_code: Number}] }, 'product_shipping');

module.exports = mongoose.model('product_category',{

	id: Number,
	category_id: Number,
	name: String,
	desciption: String

}, 'product_category');

module.exports = mongoose.model('product_custom_attributes',{

	id: Number,
	name: String,
	type: String,
	unit: String,
	value: String,
	product_id: Number

}, 'product_custom_attributes');

module.exports = mongoose.model('product_activity_log',{

	id: Number,
	product_id: Number,
	key: String,
	value: String,
	date: Date,

	//timestamp is not modeled correctly
	time: {type: Date, default: Date.now}

}, 'product_activity_log');

module.exports = mongoose.model('product_shop',{

	id: Number,
	product_id: Number,
	shop_id: Number

}, 'product_shop');

module.exports = mongoose.model('shop',{

	id: Number,
	name: String,
	phone: String,
	fax: String,
	email: String,
	website: String,
	address: String,
	x: Number,
	y: Number,
	geom: [{x: Number, y: Number}]

}, 'shop');

module.exports = mongoose.model('shop_rating',{

	id: Number,
	shop_id: Number,
	rate: Number,
	description: String

}, 'shop_rating');

module.exports = mongoose.model('product_review',{

	id: Number,
	user_id: Number,
	product_id: Number,
	comment: String

}, 'product_review');

module.exports = mongoose.model('product_user',{

	id: Number,
	product_id: Number,
	user_id: Number

}, 'product_user');

module.exports = mongoose.model('user',{

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
	user_location: [{x: Number, y: Number}]

}, 'user');

module.exports = mongoose.model('messenger_activity_log',{
//continue work...
	id: int4
	sender_user_id: int4
	sender_jid: varchar(0)
	receiver_user_id: int4
	receiver_jid: varchar(0)
	sid: varchar(0)
	rid: varchar(0)
	creation_time: timestamp(6)
	termination_time: timestamp(6)

}, 'messenger_activity_log');

module.exports = mongoose.model('user_actvity_log',{}, 'user_actvity_log');

module.exports = mongoose.model('user_lp',{}, 'user_lp');

module.exports = mongoose.model('user_config',{}, 'user_config');

module.exports = mongoose.model('spatial_ref_sys',{}, 'spatial_ref_sys');

module.exports = mongoose.model('system_setting',{}, 'system_setting');


