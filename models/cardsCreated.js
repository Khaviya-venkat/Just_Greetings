var mongoose = require("mongoose");

var CardSchema = mongoose.Schema({
	owner: String,
	event: String,
	venue: String,
	time: String, 
	date: String,
	pplInvited: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "InvitedPpl"
		}
	]
});

module.exports = mongoose.model("cardCreated", CardSchema);