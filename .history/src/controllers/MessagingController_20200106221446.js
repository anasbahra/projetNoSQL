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
                    console.log(socket.handshake.session)
                    let userMail = socket.handshake.session.user;
                    if(isUserInRoom(userMail,roomId)){
                        socket.join(roomId);
                    }
                    
                
                
            });
            socket.on('send-chat-message', (message,roomId) => {
                let userMail = socket.handshake.session.user;
                
                if(isUserInRoom(userMail,roomId)){
                    socket.broadcast.to(roomId).emit('chat-message', {message: message });
                }
                
                
            });
    });
    }

}




async function isUserInRoom(userMail , roomId){

    let user = await User.findOne({email: userMail });
    console.log('user found: ',user)
    let room =  await Room.findOne({ $or: [{_id: roomId ,userOwner : user._id} , { _id: roomId, broadcastingUserList: user._id}]});

    console.log('room found :',room);
    if(room === undefined) { 
        return false;
    }

    else { 
        return true; 
    }

}

module.exports = MessagerieController;

