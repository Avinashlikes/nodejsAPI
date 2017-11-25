var express = require("express");
var bodyparser= require("body-parser");
var mongoose = require("mongoose");
var jwt = require("./service/jwt");



var app = express();


//mongodb connnection
mongoose.connect("mongodb://localhost/APINewUser");

//for cross origin
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers","Content-Type,Authorization");

    next();
});

app.get("/", function(req, res){
        res.send("Welcome To my Node API...");
})

//userModel
var Users = require("./models/userModel");

//bodyParser
var port = process.env.PORT || 3000;
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

//app router
var userRouter = require('./routes/userRoute')(Users);

//app route config
app.use('/api/users', userRouter);

//Startup
app.listen(port, function(){
    console.log("server is listening on "+ port);
});

// console.log(jwt.encode('test','secret'));