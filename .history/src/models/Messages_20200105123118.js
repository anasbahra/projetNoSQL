var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  _id     : Schema.Types.ObjectId,
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
});

var userModel = new mongoose.model('User',userSchema);

module.exports = userModel;