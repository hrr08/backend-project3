require('dotenv').config()

const mongodb = require('mongodb'),
      shortid = require('shortid'),
      validUrl = require('valid-url');
      
var db = process.env.DB_URI;
var MongoClient = mongodb.MongoClient          

module.exports = {
    shortenUrl: shortenUrl,
    redirectUrl: redirectUrl
}

function shortenUrl(req, res){
        
        MongoClient.connect(db, function(err, db){
            if(err){
                console.log("Connection failure!");
                res.send("Not Connected!");
            }
            else{
                console.log("Connected to DB");
                var collection = db.collection('shortUrl');
                var params = req.params.url;
                
                var local = req.get('host');
            
                var newLink = function (db, callback) {
                    collection.findOne({ "url": params }, { short: 1, _id: 0 }, function (err, doc) {
                        if (doc != null) {
                            res.json({ original_url: params, short_url: local + '/' + doc.short });                    
                        }
                        else {
                            if (validUrl.isUri(params)) {
                                var shortCode = shortid.generate();
                                var newUrl = { url: params, short: shortCode };
                                collection.insert([newUrl]);
                                res.json({ original_url: params, short_url: local + '/' + shortCode });
                            } else {
                                res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
                            }                
                        }
                    })
                }  
 
                newLink(db, function () {
                    db.close();
                });            
            
            }
        })
}

function redirectUrl(req, res, next){

    MongoClient.connect(db, function (err, db) {
        if (err) {
            console.log("Unable to connect to server", err);
        } else {
            console.log("Connected to server")
 
            var findLink = function (db, callback) {
                var collection = db.collection('shortUrl');
                var params = req.params.short;          
          
                collection.findOne({ "short": params }, { url: 1, _id: 0 }, function (err, doc) {
                    if (doc != null) {
                        res.redirect(doc.url);
                    } else {
                        res.json({ error: "No corresponding shortlink found in the database." });
                    }
                });           
            };
 
            findLink(db, function () {
                db.close();
            });      
        }
    });
}