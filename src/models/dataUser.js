var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
  Avatar:  {
      type: String,
      required: true
    },
  rooms:{
    type: [],
    required: false
  },
  messagerie:{
      type: {} 

  },

});

var dataModel = new mongoose.model('DATA', dataSchema);

module.exports = dataModel;