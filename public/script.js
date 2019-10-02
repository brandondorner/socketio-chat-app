//Where our server is located
const socket = io('http://localhost:3000')
//setting variables
const messageForm = document.getElementById('text-form')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')

//takes incoming message and creates a new div with message text
const appendMessage = (message) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

if (messageForm != null){
    //Get username and join lobby, send username to other users
    let name = prompt('What is your name?')
    if (name == ''){
        name = 'Anonymous'
    }
    appendMessage('You joined')
    socket.emit('new-user', roomName, name)

    //listening to form
    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        //grabbing input value 
        const message = messageInput.value
        //send info from client to server
        socket.emit('send-chat-message', roomName, message)
        //adds the users message to his own chat
        appendMessage(`You: ${message}`)
        //clears message form
        messageInput.value=''
})
}

//whenever new room is created, do this
socket.on('room-created', room => {
    //create new room element
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    //create the new room a tag with correct href
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    //append the link and element to the homepage container
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

//whenever a message is sent, run this function
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

//whenever a new user joins, run this
socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
})

//whenever a user leaves chat, do this
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
})


