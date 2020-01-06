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
//Route Middleware
app.use('/api/user', authRoute);

app.listen(3000, () => console.log ('serveur up and running'));