var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  _id     : Schema.Types.ObjectId,
  name:  {
      type: String,
      required: true
    },
  userOwner: {
    type: Schema.Types.ObjectId,
    ref: "User"
    },
  broadcastingUserList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
     }   
]
});

var userModel = new mongoose.model('Room',roomSchema);

module.exports = userModel;