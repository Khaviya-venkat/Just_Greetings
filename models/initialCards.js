var mongoose 			  = require("mongoose");
	//passportLocalMongoose = require("passport-local-mongoose");

var CardSchema = new mongoose.Schema({
	image: String,
	title: String
});

//CardSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("InitialCard", CardSchema);