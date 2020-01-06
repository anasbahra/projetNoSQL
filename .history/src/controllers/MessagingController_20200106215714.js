const io = require ('socket.io')(9999);

const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Messages');


io.on('connection', socket => {
    socket.on('new-user', (roomId) => {
    
            socket.join(roomId);
        
        
    });
    socket.on('send-chat-message', (message,roomId) => {
        socket.broadcast.to(roomId).emit('chat-message', {message: message });
    });
});



async function isUserInRoom(userId , roomId){

    console.error('userId', userId)
    let room =  await Room.findOne({ $or: [{_id: roomId ,userOwner : userId} , { _id: roomId, broadcastingUserList: userId}]});

    if(room === undefined) { 
        return false;
    }

    else { 
        return true; 
    }

}

module.exports = io;

