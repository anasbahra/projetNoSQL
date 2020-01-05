const socket = io('http://localhost:4000');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');

var User = require('../src/models/User');
var Data = require ('../src/models/dataUser');


const avatar =prompt('choose an avatar');
appendMessage('you joined');
socket.emit('new-user', avatar);


socket.on('chat-message', data => {
    appendMessage(data);
})

socket.on('user-connected', avatar => {
    appendMessage( avatar + 'connected');
})



messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    messageInput.value='';
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);


}