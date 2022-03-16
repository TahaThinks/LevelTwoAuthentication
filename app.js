//jshint esversion:6

//Require all the modules installed:
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { log } = require("console");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// Initailizing Express & 
// serve static files such as images, 
// CSS files, and JavaScript files:

const app = express();
app.use(express.static("public"));

//Setting body-parser and ejs:
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// connecting mongoose to a mongoDB server:
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// Database Schema / update the structure to allow encryption:
const userScehma = new mongoose.Schema({
    email: String,
    password: String
});

// Add middleware for hashing passwords:
userScehma.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });

// Use the above schema to set up a new user Model
// The inside User is the collection name
const User = new mongoose.model("User", userScehma);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser.password === password)
            {
                res.render("secrets");
            }
            else
            {
                console.log("Wrong Credentials");
            }
        }
    });
});



//Activate the application using port number 3000
app.listen(3000, function(){
    console.log("server started on port 3000");
});
