var mongoose = require("mongoose");

var PplSchema = mongoose.Schema({
	name: String,
	stat: String
});

module.exports = mongoose.model("InvitedPpl", PplSchema);