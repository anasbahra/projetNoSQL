const io = require ('socket.io')(9999);
const online = {};
io.on('connection', socket => {
    socket.on('new-user', (avatar,roomId) => {
        online[socket.id] = avatar
        socket.broadcast.to(roomId).emit('user-connected', avatar)
    });
    socket.on('send-chat-message', (message,roomId) => {
        socket.broadcast.to(roomId).emit('chat-message', {message: message, avatar: online[socket.id]});
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



