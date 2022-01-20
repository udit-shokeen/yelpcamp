var mongoose = require("mongoose");

let CampSite = new mongoose.Schema({
    name: String,
    url: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

var site = mongoose.model("Camp", CampSite);
module.exports = site;
