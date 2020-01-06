var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  message:  {
      type: String,
      required: true
    },
  sentDate: Schema.Types.Date,
  emmetter: {
      type: Schema.Types.ObjectId,
      ref: 'User',

  },
  targetRoom: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }

  lastname:{
    type: String,
    required: true
  },
  email:   String,

  password: String
});

var userModel = new mongoose.model('User',userSchema);

module.exports = userModel;