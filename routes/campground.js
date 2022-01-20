var express = require("express");
var router = express.Router();

var Site = require("../models/camp");

//Homepage
router.get("/", function (req, res) {
    res.render("homepage.ejs");
});

//CampGroundDisplayPage
router.get("/camps", function (req, res) {
    let campGrounds = Site.find({}, function (err, camps) {
        if(err){
            console.log("Something Went Wrong...");
        }
        else {
            res.render("index.ejs", {camp: camps});
        }
    });
});

//Edit CampGround
//Add CampGround Page
router.get("/camps/update", isLoggedIn, function (req, res) {
    res.render("newForm.ejs");
})
//Add New Camp To DB
router.post("/camps/new", isLoggedIn, function (req, res) {
    let name = req.body.siteName;
    let url = req.body.sitePhoto;
    let desc = req.body.siteDesc;
    Site.create({name: name, url: url, description: desc}, function (err, camp) {
        if(err){
            console.log("Something went wrong...");
        }
        else{
            console.log("Data Added...");
            camp.userId = req.user._id;
            camp.save();
        }
    })
    res.redirect("/camps");
});
//Edit Form
router.get("/camps/:id/edit", isUserAuthorised,function (req, res) {
    Site.findOne({_id: req.params.id}, function (err, site) {
        if(req.user._id.equals(site.userId) || req.user.username == "admin") {
            res.render("editCamp.ejs", {site: site});
        }
        else{
            req.flash("You're not authorised to do that!");
            res.redirect("/camps/" + req.params.id);
        }
    });
});
//Update Content
router.put("/camps/:id", isUserAuthorised,function (req, res) {
    var temp = req.body.post;
    Site.findByIdAndUpdate(req.params.id, {name: temp.name, url: temp.url, description: temp.description}, function (err, updatedSite) {
        res.flash("success", "Campground successfully modified.");
        res.redirect("/camps/" + req.params.id);
    })
});
//Remove a campground from the DB
router.delete("/camps/:id/remove", isUserAuthorised,function (req, res) {
    Site.findByIdAndDelete(req.params.id, function (err) {
        if(err){
            console.log("Something went wrong...");
            req.flash("error", "Campground not found");
        }
        else{
            console.log("Data Removed...");
            req.flash("success", "Campground successfully removed.");
            res.redirect("/camps");
        }
    });
});

//Show Camp Site Details
router.get("/camps/:id", function (req, res) {
    Site.findOne({_id: req.params.id}).populate("comments").exec(function (err, camp) {
        if(!err){
            res.render("showCamp.ejs", {site: camp});
        }
    });
});

//Middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "You need to login first for this action!");
        res.redirect("/login");
    }
}

function isUserAuthorised(req, res, next){
    if(req.isAuthenticated()){
        Site.findOne({_id: req.params.id}, function (err, site) {
            if(req.user._id.equals(site.userId) || req.user.username == "admin") {
                return next();
            }
            else{
                req.flash("error", "You're not authorised to do that!");
                res.redirect("/camps/" + req.params.id);
            }
        });
    }
    else{
        req.flash("error", "You need to login first for this action!");
        res.redirect("/login");
    }
}

module.exports = router;