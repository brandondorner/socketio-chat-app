const io = require('socket.io')(3000)

const users = {}

//Whenever user loads site, do this 
io.on('connection', socket => {
    //when server recieves new user, do this
    socket.on('new-user', name => {
        //broadcast a different user has connected to all other users
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })

    //server receiving message. send-chat-message is the name of the message, message is the actual input value
    socket.on('send-chat-message', message => {
        //sends message to every other user
        socket.broadcast.emit('chat-message', message)
    })
})