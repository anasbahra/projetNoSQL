var Room = require('../src/models/Room');

var RoomsController = ( function () {

    this.getRooms = async (req,res) => {

        let user = await req.user;
        let roomList = await Room.find({ userOwner: user._id }).populate('broadcastingUserList');
        let roomsInvitedIn = await Room.find({broadcastingUserList : user._id});
        
        res.render('Room',{ rooms: roomList == null ? []: roomList  , user: user  , roomsInvitedIn : roomsInvitedIn })
        
    };

    this.getRoomById = async (req,res) => {
        let room = await Room.findById(req.params.id).populate('broadcastingUserList');;
        res.send(room);
    };

    this.createRoom =  async (req,res) => {
        let room = new Room();
        let user = await req.user;
    
        room.name = req.body.name;
        room.userOwner = user._id;
        room.broadcastingUserList = [];
        room.save();
        res.redirect('/api/user/room');
    
    };

    this.registerUser = async (req,res) => {
        let userMail = req.body.userMail;
        let roomId = req.body.roomId;
        
        let user =  await User.findOne({email : userMail});
    
        let room =  await Room.findById(roomId);
        console.log('selected' ,user);
        console.log('slected room',room);
        //register to room
        if(user !== undefined && room !== undefined) {
            let roomUpdated = await Room.update(
                { _id: roomId }, 
                { $push: { broadcastingUserList: user._id } }
            );
        }
        res.redirect('/api/user/room');
    };


});


module.exports = RoomsController;