const socket = io('http://localhost:8000');

//Get DOM elements in respective JS variables

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on recieving message
var  audio = new Audio('ting.mp3');

// function which will append to the contaner

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left') {
        audio.play();
    }
};

//Ask new user for his name 

const Name = prompt("Enter your name to join");
socket.emit('new-user-joined', Name);

//if a new user joins, let the server know

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
});

// if the 
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left')
}); 

socket.on('left', name => {
    append(`${name} left the chat`, 'right')
});


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
});

