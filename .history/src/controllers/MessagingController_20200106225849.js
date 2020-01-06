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
                    let userMail = socket.handshake.session.passport.user;
                    if(isUserInRoom(userMail,roomId)){
                        let messages = getMessages(roomId).map(message => message.message);
                        socket.broadcast.to(roomId).emit('history-message', {messages: message });
                        socket.join(roomId);
                    }
                    
                
                
            });
            socket.on('send-chat-message', (message,roomId) => {
                let userMail = socket.handshake.session.passport.user;
                
                if(isUserInRoom(userMail,roomId)){
                    storeMessage(userMail,message,roomId);
                    socket.broadcast.to(roomId).emit('chat-message', {message: message });
                }
                
                
            });
    });
    }

}




async function isUserInRoom(userMail , roomId){

    let user = await User.findOne({email: userMail });
    let room =  await Room.findOne({ $or: [{_id: roomId ,userOwner : user._id} , { _id: roomId, broadcastingUserList: user._id}]}).populate('broadcastingUserList');
   console.log('roomFound:',room);
    if(room === undefined) { 
        return false;
    }

    else { 
        return true; 
    }

}


async function storeMessage(userMail, message , roomId ){

    let user = await User.findOne({email: userMail});
    let message = new Messages();
    message.message = message;
    message.sendDate = new Date();
    message.emetter = user._id;
    message.targetRoom = roomId;
    message.save();


}

async function getMessages(roomId ){
    return await Messages.find({targetRoom: roomId}).sort({sendDate: 1});
}

module.exports = MessagerieController;

