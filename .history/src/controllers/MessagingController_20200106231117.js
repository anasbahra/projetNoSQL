const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Messages');



class MessagerieController {

    constructor(io){
       this.io = io; 
    }

    connect(){
        this.io.on('connection', socket => {
            socket.on('new-user', async (roomId) => {
                    let userMail = socket.handshake.session.passport.user;
                    if(isUserInRoom(userMail,roomId)){
                        let messages =  await getMessages(roomId);
                        let contentMessages =  messages.map(message => message.message);
                        socket.broadcast.to(roomId).emit('history-message', {messages: contentMessages });
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

    console.log('store message');
    let user = await User.findOne({email: userMail});
    let msg = new Message();
    msg.message = message;
    msg.sendDate = new Date();
    msg.emetter = user._id;
    msg.targetRoom = roomId;
    msg.save();


}

 function getMessages(roomId) {
   return Message.find({targetRoom: roomId}).sort({sendDate: 1});
}

module.exports = MessagerieController;

