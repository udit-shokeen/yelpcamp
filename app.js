//Yelp Camp Driver APP
var PORT = process.env.PORT || 3000;

const express    = require("express");
const app        = express();

const request    = require("request");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/yelpCampV2');
mongoose.connect('mongodb+srv://udit:udit@yelpcamp-cxpnu.mongodb.net/yelpCamp?retryWrites=true&w=majority', {useNewUrlParser: true});

const flash = require("connect-flash");
app.use(flash());

const Site = require("./models/camp");
const Comment = require("./models/comment");

const passport = require("passport");
const passportLocal = require("passport-local");
const passportMongoose = require("passport-local-mongoose");
const User = require("./models/user");

app.use(require("express-session")({
    secret: "Yelp Camp V2",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var campgroundRoute = require("./routes/campground");
var commentRoute = require("./routes/comment");
var authenticationRoute = require("./routes/authentication");


//Middleware to send userId to all local templates
app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(campgroundRoute);
app.use(commentRoute);
app.use(authenticationRoute);

// var seed = require("./seeder");
// seed();

//Server Setup
app.listen(PORT, function () {
    console.log("Server started...");
})