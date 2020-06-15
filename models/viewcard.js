var mongoose = require("mongoose");

var ViewCardSchema = mongoose.Schema({
	owner: String,
	event: String,
	venue: String,
	time: String, 
	date: String
});

module.exports = mongoose.model("viewcard", ViewCardSchema);