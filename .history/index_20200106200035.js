const express = require ('express');
const app = express();

var path = require('path');
var expressLayouts = require('express-ejs-layouts');
 
console.log(path.join(__dirname,'src/web'));
app.set('views',path.join(__dirname,'src/web'))
app.set('view engine', 'ejs');
 
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false}));
//Import Routes 
const routes = require ('./src/routes/routes');

// connecting to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inbox', {useNewUrlParser: true});


//Route Middleware
app.use('/api/user', routes);

// starting up
app.listen(3000, () => console.log ('serveur up and running'));