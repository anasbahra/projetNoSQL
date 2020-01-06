const router = require ('express').Router();
var User = require('../src/models/User');
const io = require ('socket.io')(9999);

const online = {};

io.on('connection', socket => {
    socket.on('new-user', (avatar) => {
        online[socket.id] = avatar
        socket.broadcast.emit('user-connected', avatar)
    });
    socket.on('send-chat-message', (message) => {
        console.log('message',message);
        socket.broadcast.emit('chat-message', {message: message, avatar: online[socket.id]});
    });
});






