var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
    {
        author: String,
        content: String,
        date: { type: Date},
        userId: {type: mongoose.Schema.Types.ObjectId,
                ref: "User"
              }
    });

module.exports = mongoose.model("Comment", commentSchema);