const express = require ('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
//Import Routes 
const routes = require ('./routes/auth');

// connecting to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inbox', {useNewUrlParser: true});


//Route Middleware
app.use('/api/user', routes);

// starting up
app.listen(3000, () => console.log ('serveur up and running'));