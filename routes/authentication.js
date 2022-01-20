var express = require("express");
var router = express.Router();

var User = require("../models/user");
var passport = require("passport");

//Signup
router.get("/signup", function (req, res) {
    res.render("signupForm.ejs");
})

router.post("/signup", function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            req.flash("error", err.message);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", req.user.username + ", You're signed up successfully.");
            res.redirect("/camps");
        });
    });
});

//Login
router.get("/login", function (req, res) {
    res.render("loginForm.ejs");
});
router.post("/login", passport.authenticate("local",{
        successRedirect: "/camps",
        failureRedirect: "/login"
    }), function (req, res) {}
);

//Logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You've successfully logged out.");
    res.redirect("/");
})

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "You need to login first!");
        res.redirect("/login");
    }
}

module.exports = router;
