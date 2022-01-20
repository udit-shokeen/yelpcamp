var mongoose = require("mongoose");

var Site = require("./models/camp");
var Comment = require("./models/comment");

var data = [
    {name: "Trail In China",
     url: "https://indianetzone.files.wordpress.com/2020/02/7.-chinese-hemlock-trail-tapingshan-taiwan-22-mysterious-forests-ie28099d-love-to-get-lost-in.jpg",
     description: "Green trails leading nowhere in the middle of woods..."
    },
    {name: "Silent Valley",
     url: "https://inhabitat.com/wp-content/blogs.dir/1/files/2016/05/india-silent-valley-forest-889x592.jpg",
     description: "The great forest cover of the Silent Valley, India. Great for nature lovers and trekers."
    },
    {name: "Waterfall",
     url: "https://i.pinimg.com/originals/bc/da/f3/bcdaf3fb4207cc4ae3b688ee29c1e3d5.jpg",
     description: "Yes it's small, but just look at it, awesome place, lots of green, extremely soothing."
    }];

function seedDb() {
    //Remove data from DB
    Site.remove({}, function (err) {
        if(!err){
            console.log("DB reseted...");

            //Add new data in DB
            data.forEach(function (site){
                Site.create({
                    name: site.name,
                    url: site.url,
                    description: site.description
                }, function (err, newCamp) {
                        if(!err){
                            console.log("Site Created...");

                            //Create a new comment
                            Comment.create({
                                author: "UDIT SHOKEEN",
                                content: "This is the first comment and i am proud of my progress so far...",
                                date: Date.now()
                            }, function (err, comment) {
                                if(!err){
                                    //Link comment to campsite
                                    newCamp.comments.push(comment);
                                    newCamp.save();
                                    console.log("Comment Added...");
                                }
                            });
                            console.log(newCamp);
                        }
                });
            });
        }
    });
};

module.exports = seedDb;