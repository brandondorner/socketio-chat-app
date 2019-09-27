//creating express server that can communicate with socket.io
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

//set up express server
app.set('views', './views' )
//telling server to use ejs
app.set('view engine', 'ejs')
//telling server js files will be in public folder
app.use(express.static('public'))
//ablity to accept url parameters
app.use(express.urlencoded({ extended: true}))

//zero rooms to start
const rooms = { room1: {}} 

//routes
//at route index, render inex file as well as rooms
app.get('/', (req, res) => {
    res.render('index', { rooms : rooms})
})

app.post('/room', (req, res) => {
    //if new room already exists, redirect to index
    if (rooms[req.body.newRoom] != null){
        return res.redirect('/')
    }
    //adds new-room to rooms object
    //add an empty list of users to the newly created room key. then redirect to page
    rooms[req.body.newRoom] = { users: {} }
    res.redirect(req.body.newRoom)
    //send message that new room was created to other users
    io.emit('room-created', req.body.newRoom)
})

//when given the url parameter of room, render the room file
//and store the room parameter in the roomName variable
app.get('/:room', (req, res) => {
    //if room doesn't exist, redirect to homepage
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room})
})

server.listen(3000)

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
        //sends {username and message} to every other user
        socket.broadcast.emit('chat-message', { name: users[socket.id], message: message  })
    })
    //when user leaves chat, broadcast to ther users and delete the user who left
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})