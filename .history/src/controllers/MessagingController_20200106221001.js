const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Messages');



class MessagerieController {

    constructor(io){
       this.io = io; 
    }

    connect(){
        this.io.on('connection', socket => {
            socket.on('new-user', (roomId) => {
                    let userMail = socket.handshake.session.user;
                    if(isUserInRoom())
                    socket.join(roomId);
                
                
            });
            socket.on('send-chat-message', (message,roomId) => {
                socket.broadcast.to(roomId).emit('chat-message', {message: message });
            });
    });
    }

}




async function isUserInRoom(userMail , roomId){

    let user = await User.findOne({email: mail });
    let room =  await Room.findOne({ $or: [{_id: roomId ,userOwner : userId} , { _id: roomId, broadcastingUserList: userId}]});

    if(room === undefined) { 
        return false;
    }

    else { 
        return true; 
    }

}

module.exports = MessagerieController;

