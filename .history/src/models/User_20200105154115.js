var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id     : Schema.Types.ObjectId,
  name:  {
      type: String,
      required: true
    },
  lastname:{
    type: String,
    required: true
  },
  email:   {
    type: String,
    unique: true
  },
  password: String
});

var userModel = new mongoose.model('User',userSchema);

module.exports = userModel;