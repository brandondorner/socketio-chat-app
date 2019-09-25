const io = require('socket.io')(3000)

//Whenever user loads site, do this 
io.on('connection', socket => {
    //server receiving message. send-chat-message is the name of the message, message is the actual input value
    socket.on('send-chat-message', message => {
        //sends message to every other user
        socket.broadcast.emit('chat-message', message)
    })
})