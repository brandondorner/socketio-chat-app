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
const rooms = { } 

//routes
//at route index, render inex file as well as rooms
app.get('/', (req, res) => {
    res.render('index', { rooms : rooms})
})

app.post('/room', (req, res) => {
    console.log(req)
    //if new room already exists, redirect to index
    if (rooms[req.body.room] != null){
        return res.redirect('/')
    }
    //adds newRoom, from script.js, to rooms object
    //add an empty list of users to the newly created room key. 
    //then redirect to page
    rooms[req.body.room] = {users: {}} //
    res.redirect(req.body.room)
    //send message that new room was created to other users
    io.emit('room-created', req.body.room)
})

//when given the url parameter of room, render the room file
//and store the room parameter in the roomName variable
//and pass roomName variable to room.ejs
app.get('/:room', (req, res) => {
    //if room doesn't exist, redirect to homepage
    if (rooms[req.params.room] == null) {//newroom
        return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room})//
})

server.listen(3000)

//Whenever user loads site, do this 
io.on('connection', socket => {
    //when server receives new user, do this
    socket.on('new-user', (room, name) => {
        //join a room then
        console.log(room, 'r2')
        socket.join(room)
        //access roomName out of rooms var, then grab the users from that room and assign the specific user the inputed name
        console.log(rooms)
        console.log(name)
        rooms[room].users[socket.id] = name
        //broadcast user (name) has connected to all other users in param 'roomName'
        socket.to(room).broadcast.emit('user-connected', name)
    })

    //server receiving message. send-chat-message is the name of the message, message is the actual input value
    socket.on('send-chat-message', (roomName, message) => {
        //sends {(user)name and message} to script.js 
        socket.to(roomName).broadcast.emit('chat-message', { message: message,  name: rooms[roomName].users[socket.id]  })
    })
    //when user leaves chat, broadcast to the users and delete the user who left
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(roomName => {
            //when user disconnects, broadcast this event and delete user from the room
            socket.to(roomName).broadcast.emit('user-disconnected', rooms[roomName].users[socket.id])
            delete rooms[roomName].users[socket.id]
        })

    })
})

//check all rooms, and return all rooms that the user is a part of
const getUserRooms = (socket) => {
    //object entries is a method that converts that rooms object into an array of entries
    //roomName, room is the key value pair for rooms. names is the accumulator
    return Object.entries(rooms).reduce((names, [roomName, room]) => {
        //if user exists, push name of the room to names (list of all room names)
        console.log('getuserrooms', rooms)
        if (room.users[socket.id] != null){
            names.push(roomName)
        }
        return names
    }, [])
}