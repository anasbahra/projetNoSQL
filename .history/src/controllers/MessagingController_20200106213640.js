const io = require ('socket.io')(9999);
const online = {};
io.on('connection', socket => {
    socket.on('new-user', (roomId) => {
        socket.join(roomId);
    });
    socket.on('send-chat-message', (message,roomId) => {
        socket.broadcast.to(roomId).emit('chat-message', {message: message });
    });
});



async function isUserInRoom(req , roomId){
    
    let user = await req.user;
    let room = Room.findOne({ $or: [{_id: roomId ,userOwner : user._id } , { _id: roomId, broadcastingUserList: user._id }]});

    if(room === undefined) { 
        return false;
    }
    else { 
        return true; 
    }

}



