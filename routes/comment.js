var express = require("express");
var router = express.Router();

var Site = require("../models/camp");
var Comment = require("../models/comment");

//Post a comment
router.put("/camps/:id/comment", isLoggedIn, function (req, res) {
    Comment.create({author: req.user.username, content: req.body.comment, date: Date.now(), userId: req.user._id}, function (err, comment) {
        if(!err){
            Site.findById(req.params.id, function (err, foundSite) {
                if(!err){
                    foundSite.comments.push(comment);
                    foundSite.save();
                    console.log("Comment Added...");
                    req.flash("success", "Comment added successfully.")
                    res.redirect("/camps/" + req.params.id);
                }
            });
        }
    });
});

router.delete("/camps/:siteId/comment/:commentId/delete", isUserAuthorised, function (req, res) {
    Comment.findByIdAndDelete(req.params.commentId, function (err) {
        req.flash("success", "Comment deleted successfully.")
        res.redirect("/camps/" + req.params.siteId);
    });
})

//Middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "You need to login first to do that!");
        res.redirect("/login");
    }
}

function isUserAuthorised(req, res, next){
    if(req.isAuthenticated()){
        Comment.findOne({_id: req.params.commentId}, function (err, comment) {
            if(!err){
                if(req.user._id.equals(comment.userId) || req.user.username == "admin"){
                    return next();
                }
            }
            req.flash("error", "You're not authorised to do that!");
            res.redirect("/camps/" + req.params.siteId);
        });
    }
    else{
        req.flash("error", "You need to login first to do that!");
        res.redirect("/login");
    }
}

module.exports = router;