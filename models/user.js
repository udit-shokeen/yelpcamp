var mongoose = require("mongoose");
var auth = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(auth);

module.exports = mongoose.model("User", userSchema);