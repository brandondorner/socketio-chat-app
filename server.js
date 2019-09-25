const io = require('socket.io')(3000)

//Whenever user loads site, do this 
io.on('connection', socket => {
    socket.emit('chat-message', 'hello bitch')
})