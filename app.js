//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



const app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.route("/")
.get((req, res)=>{
    res.render("home");
});

app.route("/login")
.get((req, res)=>{
    res.render("login");
})
.post((req, res)=>{
const user = req.body.username;
const password = req.body.password;

User.findOne({email: user}, (err, result)=>{
    if(result.password === password){
        res.render("secrets");
    }else{
        console.log(err);
        res.send("Incorrecto");
    }

})
});


app.route("/register")
.get((req, res)=>{
    res.render("register");
})
.post((req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err)=>{
        if(!err){
            console.log("Se creó el nuevo usuario");
            res.render("secrets");
        }else{
            console.log(err);
        }
    })
});







app.listen(3000, ()=>{
    console.log("está funkando en el puerto 3000");
});