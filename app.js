var express               = require("express"),
	app 				  = express(),
    mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	InitialCard			  = require("./models/initialCards"),
	CreatedCard		      = require("./models/cardsCreated"),
	ViewCard			  = require("./models/viewcard"),
	InvitedPpl 			  = require("./models/InvitedPpl"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
	mongoDB = ("mongodb://localhost/JustGreetings");

var viewcards = [];
var acceptedcards = [];
var declinedcards = [];

mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDB, { useNewUrlParser: true });

app.set("view engine","ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));
app.use(require("express-session")({
	  secret : "i love waffles",
	  resave : false,
	  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/signup", function(req, res){
	res.render("signup");
});

app.post("/signup",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username : req.body.username}),req.body.password,function(err,user){
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
});

app.get("/login",function(req,res){
	res.render("login");
	req.logout();
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/userhomepage",
	failureRedirect:"/login"
}),function(req,res){
	req.body.username
	req.body.password
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

app.get("/userhomepage", isLoggedIn, function(req, res){
	var username = req.user.username;
	res.render("userhomepage", {username: username});
});

app.get("/:username/new", function(req, res){
	var username = req.user.username;
	res.render("new", {username: username});
});

app.post("/:username/new", function(req, res){
	var owner = req.body.yourname;
	var event = req.body.event;
	var venue = req.body.venue;
	var time = req.body.time;
	var date = req.body.date;
	var invitee1 = {name: req.body.invitee1, stat: "Not Viewed"};
	var invitee2 = {name: req.body.invitee2, stat: "Not Viewed"};
	var invitee3 = {name: req.body.invitee3, stat: "Not Viewed"};
	var invitee4 = {name: req.body.invitee4, stat: "Not Viewed"};
	var invitee5 = {name: req.body.invitee5, stat: "Not Viewed"};
	var newEvent = {owner: owner, event: event, venue: venue, time: time, date: date};
	CreatedCard.create(newEvent, function(err, card){
		if(err){
			console.log(err);
		}
		else{
			InvitedPpl.create(invitee1, function(err, person1){
				if(err){
					console.log(err);
				}	
				else{
					card.pplInvited.push(person1);
				}
			});
			InvitedPpl.create(invitee2, function(err, person2){
				if(err){
					console.log(err);
				}	
				else{
					card.pplInvited.push(person2);
				}
			});
			InvitedPpl.create(invitee3, function(err, person3){
				if(err){
					console.log(err);
				}	
				else{
					card.pplInvited.push(person3);
				}
			});
			InvitedPpl.create(invitee4, function(err, person4){
				if(err){
					console.log(err);
				}	
				else{
					card.pplInvited.push(person4);
				}
			});
			InvitedPpl.create(invitee5, function(err, person5){
				if(err){
					console.log(err);
				}	
				else{
					card.pplInvited.push(person5);
					card.save();
				}
			});
			res.render("donePage");
		}
	});	
});

app.get("/:username/createdcards", function(req, res){
	CreatedCard.find({owner: req.params.username}, function(err, allCards){
		if(err){
			console.log(err);
		}
		else{
			res.render("createdcards", {cards: allCards});
		}
	});
});

app.get("/:id/view", function(req, res){
	CreatedCard.findById(req.params.id, function(err, createdCard){
		if(err){
			console.log(err);
		}
		else{
			res.render("viewcard", {card: createdCard});
		}
	});
});

app.get("/:id/view/invitees", function(req, res){
	//CreatedCard.findById(req.params.id, function(err, createdCard){
	CreatedCard.findById(req.params.id).populate("pplInvited").exec(function(err, createdCard){	
			if(err){
				console.log(err);
			}
			else{
				res.render("viewinvitees", {card: createdCard});
			}
		});
});

app.get("/view/userhomepage", function(req, res){
	ViewCard.deleteMany({}, function(err, deleted){
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/userhomepage");

		}
	});
});

app.get("/:username/viewinvites", function(req, res){
	var username = req.user.username;
	if(viewcards.length > -1){
		for(i = viewcards.length; i > 0; i --){
			viewcards.pop();
		}
	}
	
	CreatedCard.find({}).populate("pplInvited").exec(function(err, allcards){
		if(err){
			console.log(err);
		}
		else{

			allcards.forEach(function(card){
				card.pplInvited.forEach(function(p){
					for(var i = 0; i < 1; i ++){
						if(p.name === username){
							var owner = card.owner;
							var event = card.event;
							var venue = card.venue;
							var time = card.time;
							var date = card.date;
							var _id = card._id;
							var newcard = {owner: owner, event: event, venue: venue, time: time, date: date, _id: _id};
							viewcards.push(newcard);
						}
					}
				});
			});
		}	
		res.render("viewinvitation", {username: username, cards: viewcards});
	});
});

app.get("/:username/:id/stat/accepted", function(req, res){
	var username = req.params.username;
	CreatedCard.findById(req.params.id, function(err, foundcard){
		if(err){
			console.log(err);
		}
		else{
			for(var i = 0; i < 5; i ++){
				foundcard.pplInvited[i];
				InvitedPpl.findById(foundcard.pplInvited[i], function(err, foundperson){
					if(err){
						console.log(err);
					}
					else{
						if(foundperson.name === req.params.username){
							InvitedPpl.findByIdAndUpdate(foundperson._id, {$set:{'stat': 'accepted'}}, function(err, updated){
								if(err){
									console.log(err);
								}
								else{
									res.render("statuschanged", {card: foundcard, person: foundperson});
								}
							});
						}
					}
				});
			}
		}
	});
});

app.get("/:username/:id/stat/declined", function(req, res){
	var username = req.params.username;
	CreatedCard.findById(req.params.id, function(err, foundcard){
		if(err){
			console.log(err);
		}
		else{
			var card = foundcard;
			for(var i = 0; i < 5; i ++){
				foundcard.pplInvited[i];
				InvitedPpl.findById(foundcard.pplInvited[i], function(err, foundperson){
					if(err){
						console.log(err);
					}
					else{
						if(foundperson.name === req.params.username){
							InvitedPpl.findByIdAndUpdate(foundperson._id, {$set:{'stat': 'declined'}}, function(err, updated){
								if(err){
									console.log(err);
								}
								else{
									res.render("statuschanged", {card: foundcard, person: foundperson});
								}
							});
						}
					}
				});
			}
		}
	});
});

app.get("/:username/stat/acceptedinvites", function(req, res){
	var username = req.params.username;
	var count = 0;
	if(acceptedcards.length > 0){
		for(i = acceptedcards.length; i > -1; i --){
			acceptedcards.pop();
		}
	}
	CreatedCard.find({}, async function(err, allcards){
		if(err){
			console.log(err);
		}
		else{
			for(var c=0; c < allcards.length; c++){
				var card = allcards[c];
				for(var i = 0; i< 5 && card.pplInvited[i]; i ++){
					await InvitedPpl.findById(card.pplInvited[i], function(err, foundperson){
						if(err){
							console.log(err);
						}
						else{
							if(foundperson.name === username){
								if(foundperson.stat === "accepted"){
									var owner = card.owner;
									var event = card.event;
									var venue = card.venue;
									var time = card.time;
									var date = card.date;
									var _id = card._id;
									var newcard = {owner: owner, event: event, venue: venue, time: time, date: date, _id: _id};
									acceptedcards.push(newcard);
								}
							}
						}
					});
				}
			}
			res.render("acceptedinvitations", {username: username, cards: acceptedcards});
		}
	});
});

app.get("/:username/stat/declinedinvites", function(req, res){
	var username = req.params.username;
	var count = 0;
	if(acceptedcards.length > 0){
		for(i = acceptedcards.length; i > -1; i --){
			acceptedcards.pop();
		}
	}
	CreatedCard.find({}, async function(err, allcards){
		if(err){
			console.log(err);
		}
		else{
			for(var c = 0; c < allcards.length; c++){
				var card = allcards[c];
				for(var i = 0; i< 5 && card.pplInvited[i]; i ++){
					await InvitedPpl.findById(card.pplInvited[i], function(err, foundperson){
						if(err){
							console.log(err);
						}
						else{
							if(foundperson.name === username){
								if(foundperson.stat === "declined"){
									var owner = card.owner;
									var event = card.event;
									var venue = card.venue;
									var time = card.time;
									var date = card.date;
									var _id = card._id;
									var newcard = {owner: owner, event: event, venue: venue, time: time, date: date, _id: _id};
									declinedcards.push(newcard);
								}
							}
						}
					});
				}
			}
			res.render("declinedinvitations", {username: username, cards: declinedcards});
		}
	});
});
	
function isLoggedIn(req ,res ,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(req, res){
	console.log("Server has Started!");
});