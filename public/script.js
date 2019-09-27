//Where our server is located
const socket = io('http://localhost:3000')
//setting variables
const messageForm = document.getElementById('text-form')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('message-container')

//takes incoming message and creates a new div with message text
const appendMessage = (message) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

if (messageForm != null){
    //Get username and join lobby, send username to other users
    const name = prompt('What is your name?')
    appendMessage('You joined')
    socket.emit('new-user', name)

    //listening to form
    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        //grabbing input value 
        const message = messageInput.value
        //send info from client to server
        socket.emit('send-chat-message', message)
        //clears message form
        messageInput.value=''
        //adds the users message to his own chat
        appendMessage(`You: ${message}`)

})
}

socket.on('room-created', newRoom => {
    
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


