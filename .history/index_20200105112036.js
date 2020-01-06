const express = require ('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
//Import Routes 
const authRoute = require ('./routes/auth');
const chatRoute = require ('./routes/chat');


// connecting to database of users
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inbox', {useNewUrlParser: true});

//import models

var User = require('./src/models/User');

let user = new User();

user.name = 'Bahra';
user.lastname = 'Anas';
user.password = 'pass';

user.save();


User.find({}).then(res => {
    console.log(res);
})
 

//Route Middleware
app.use('/api/user', authRoute);

app.listen(3000, () => console.log ('serveur up and running'));