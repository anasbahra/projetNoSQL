const io = require ('socket.io')(9999);

io.on('connection', socket => {

       
    socket.join(req.params.roomId);
    socket.on('new-user', (avatar,roomId) => {
        online[socket.id] = avatar
        socket.broadcast.to(roomId).emit('user-connected', avatar)
    });
    socket.on('send-chat-message', (message,roomId) => {
        console.log('message',message);
        socket.broadcast.to(roomId).emit('chat-message', {message: message, avatar: online[socket.id]});
    });
});




