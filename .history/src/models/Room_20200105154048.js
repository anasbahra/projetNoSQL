var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  name:  {
      type: String,
      required: true,
      unique:true
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