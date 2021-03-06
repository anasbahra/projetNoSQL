const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Messages');
var mongoose = require('mongoose');

let ObjectId = mongoose.Types.ObjectId;


class MessagerieController {

    constructor(io){
       this.io = io; 
    }

    connect(){
        this.io.on('connection', socket => {
            socket.on('new-user', (roomId) => {
                    let userMail = socket.handshake.session.passport.user;
                    if(isUserInRoom(userMail,roomId)){
                        socket.join(roomId);
                    }
                    
                
                
            });
            socket.on('send-chat-message', (message,roomId) => {
                let userMail = socket.handshake.session.passport.user;
                
                if(isUserInRoom(userMail,roomId)){
                    socket.broadcast.to(roomId).emit('chat-message', {message: message });
                }
                
                
            });
    });
    }

}




async function isUserInRoom(userMail , roomId){

    let user = await User.findOne({email: userMail });
    console.log('user found : ',await Room.find({_id:ObjectId(roomId)}).populate('userOwner'));
    let room =  await Room.findOne( { _id: ObjectId(roomId), broadcastingUserList: mongoose.Types.ObjectId(user._id) }).populate('broadcastingUserList');

    console.log('room found :',room);
    if(room === undefined) { 
        return false;
    }

    else { 
        return true; 
    }

}

module.exports = MessagerieController;

