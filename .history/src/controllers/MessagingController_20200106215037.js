const io = require ('socket.io')(9999);

const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Messages');


io.on('connection', socket => {
    socket.on('new-user', (roomId) => {
        let userId = socket.handshake.session.userdata._id;
        socket.join(roomId);
    });
    socket.on('send-chat-message', (message,roomId) => {
        console.log('socker user : ', socket.handshake.session.userdata);
        socket.broadcast.to(roomId).emit('chat-message', {message: message });
    });
});



async function isUserInRoom(userId , roomId){
    
    let user = await req.user;
    let room = Room.findOne({ $or: [{_id: roomId ,userOwner : user._id } , { _id: roomId, broadcastingUserList: user._id }]});

    if(room === undefined) { 
        return false;
    }

    else { 
        return true; 
    }

}

module.exports = io;

