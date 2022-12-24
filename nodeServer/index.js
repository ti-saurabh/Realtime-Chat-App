// const { socket } = require('socket.io');
const express = require('express');

const app = express();

let http = require("http").createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const users = {};

http.listen(8000, function () {
    console.log("server started...")

   //if any new user joins, let other users connected to server know!

    io.on('connection', socket => {
        socket.on('new-user-joined', name =>{
            // console.log("New-user", name);
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        });

        //if someone sends a message, broadcast it to other people

        socket.on('send', message => {
            socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
        });

        //if someone leaves the chat, let others know!
        
        socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        });

    });
});
