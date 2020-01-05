var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  {
      type: String,
      required: true
    },
  lastname:{
    type: String,
    required: true
  },
  email:   String,

  password: String
});

var userModel = new mongoose.model('User',userSchema);

module.exports = userModel;