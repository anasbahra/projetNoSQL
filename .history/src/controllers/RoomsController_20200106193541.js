var Room = require('../src/models/Room');
var RoomsController = ( function () {

    this.getRooms = async (req,res) => {

        let user = await req.user;
        let roomList = await Room.find({ userOwner: user._id }).populate('broadcastingUserList');
        let roomsInvitedIn = await Room.find({broadcastingUserList : user._id});
        
        res.render('Room',{ rooms: roomList == null ? []: roomList  , user: user  , roomsInvitedIn : roomsInvitedIn })
        
    };

    this.getRoomById = async (req,res) => {

    };

    this.createRoom =  async (req,res) => {

    };

    this.registerUser = async (req,res) => {

    };


});